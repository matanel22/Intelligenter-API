import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import domainRoutes from './routes/domainRoutes.js';
import { requestLogger, ipExtractor } from './utils/requestLogger.js';
import { startScheduler } from './scheduler/scheduler.js';

import './services/queueService.js';


dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(ipExtractor);
app.use(requestLogger);


app.use('/api/domains', domainRoutes);


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Intelligenter API is running' });
});


const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


(async () => {
  try {
    const { db } = await import('./db/knex.js');
    await db.raw('SELECT 1');
    console.log('✅ Database connection successful!');
    
 
    startScheduler();
  } catch (error) {
    console.error('❌ Database connection failed:', error instanceof Error ? error.message : String(error));
  }
})();

export default app;