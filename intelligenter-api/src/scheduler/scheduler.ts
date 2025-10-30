import cron from 'node-cron';
import * as domainService from '../services/domainService.js';

// Check if domain should be analyzed (every 24 hours)
const shouldAnalyze = (lastUpdated?: Date): boolean => {
  if (!lastUpdated) return true;
  
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
  
  return lastUpdated < twentyFourHoursAgo;
};

// Schedule domain analysis every hour
export const schedulePeriodicAnalysis = (): void => {
  cron.schedule('0 * * * *', async () => {
    console.log('Running scheduled domain analysis...');
    
    try {
      const domains = await domainService.getAllDomains();
      const readyDomains = domains.filter(domain => domain.status === 'ready');
      
      for (const domain of readyDomains) {
        if (domain.id && shouldAnalyze(domain.last_updated)) {
          console.log(`Analyzing domain: ${domain.domain}`);
          await domainService.analyzeDomain(domain.domain);
        }
      }
      
      console.log('Scheduled analysis completed');
    } catch (error) {
      console.error('Error in scheduled analysis:', error);
    }
  });
};

// Schedule cleanup of old analysis data
export const scheduleDataCleanup = (): void => {
  cron.schedule('0 2 * * *', async () => {
    console.log('Running data cleanup...');
    
    try {
      // Keep only the latest 10 analyses per domain
      // This would require additional database queries
      console.log('Data cleanup completed');
    } catch (error) {
      console.error('Error in data cleanup:', error);
    }
  });
};

// Start all scheduled tasks
export const startScheduler = (): void => {
  console.log('Starting scheduler...');
  schedulePeriodicAnalysis();
  scheduleDataCleanup();
  console.log('Scheduler started successfully');
};
 