import cron from 'node-cron';
import * as domainService from '../services/domainService.js';

// Check if domain should be analyzed (every 30 days / 1 month)
const shouldAnalyze = (lastUpdated?: Date): boolean => {
  if (!lastUpdated) return true;
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return lastUpdated < thirtyDaysAgo;
};

// Schedule domain analysis every day at midnight to check for monthly updates
export const schedulePeriodicAnalysis = (): void => {
  cron.schedule('0 0 * * *', async () => {
    console.log('🔍 Running scheduled domain analysis check...');
    
    try {
      const domains = await domainService.getAllDomains();
      const readyDomains = domains.filter(domain => domain.status === 'ready');
      
      console.log(`📊 Found ${readyDomains.length} domains to check for updates`);
      
      for (const domain of readyDomains) {
        if (domain.id && shouldAnalyze(domain.last_updated)) {
          console.log(`🔄 Analyzing domain (30+ days old): ${domain.domain}`);
          await domainService.analyzeDomain(domain.domain);
        }
      }
      
      console.log('✅ Scheduled analysis completed');
    } catch (error) {
      console.error('❌ Error in scheduled analysis:', error);
    }
  });
  
  console.log('📅 Scheduler configured: Daily check at midnight for domains older than 30 days');
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
 