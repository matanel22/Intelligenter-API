import cron from 'node-cron';
import * as domainService from '../services/domainService.js';
import { queueAnalysis } from '../services/queueService.js';


const shouldAnalyze = (lastUpdated?: Date): boolean => {
  if (!lastUpdated) return true;
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return lastUpdated < thirtyDaysAgo;
};


export const schedulePeriodicAnalysis = (): void => {
  cron.schedule('0 0 * * *', async () => {
    
    
    try {
      const domains = await domainService.getAllDomains();
      const readyDomains = domains.filter(domain => domain.status === 'ready');
      
     
      
      for (const domain of readyDomains) {
        if (domain.id && shouldAnalyze(domain.last_updated)) {
          console.log(`🔄 Queuing domain for analysis (30+ days old): ${domain.domain}`);
          await queueAnalysis(domain.domain);
        }
      }
      
      
    } catch (error) {
      console.error('❌ Error in scheduled analysis:', error);
    }
  });
  
 
};


export const scheduleDataCleanup = (): void => {
  cron.schedule('0 2 * * *', async () => {
   
    
    try {
   
      
    } catch (error) {
      console.error('Error in data cleanup:', error);
    }
  });
};


export const startScheduler = (): void => {

  schedulePeriodicAnalysis();
  scheduleDataCleanup();
 
};
 