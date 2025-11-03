
import { Queue, Worker, Job } from 'bullmq';
import * as domainService from './domainService.js';

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};


export const analysisQueue = new Queue('domain-analysis', {
  connection: redisConfig,
});


const analysisWorker = new Worker(
  'domain-analysis',
  async (job: Job) => {
    const { domain } = job.data;
    
    try {
      console.log(`🔍 Processing analysis for: ${domain}`);
      await domainService.analyzeDomain(domain);
      console.log(`✅ Analysis completed for: ${domain}`);
      return { success: true, domain };
    } catch (error) {
      console.error(`❌ Analysis failed for ${domain}:`, error);
      throw error;


    }
  },
  { 
    connection: redisConfig,
    concurrency: 5, 
  }
);


export const queueAnalysis = async (domain: string) => {
  try {
    const job = await analysisQueue.add('analyze-domain', { domain }, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      delay: 1000,
    });
    
    console.log(`📤 Queued analysis for ${domain} (Job ID: ${job.id})`);
    return job;
  } catch (error) {
    console.error('Failed to queue analysis:', error);
    throw error;
  }
};

analysisWorker.on('completed', (job: Job) => {
  console.log(`Job ${job.id} completed`);
});

analysisWorker.on('failed', (job: Job | undefined, error: Error) => {
  console.error(` Job ${job?.id || 'unknown'} failed:`, error.message);
});

analysisWorker.on('error', (error: Error) => {
  console.error('Worker error:', error);
});

process.on('SIGINT', async () => {
  console.log('Shutting down worker...');
  await analysisWorker.close();
  await analysisQueue.close();
});

export { analysisWorker };
export default analysisQueue;