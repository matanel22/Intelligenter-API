import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import domainRoutes from './routes/domainRoutes.js';
import { startScheduler } from './scheduler/scheduler.js';
import { generalLimiter } from './middleware/rateLimiting.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const PORT = process.env.PORT || 3000;


app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));


app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com', 'https://www.yourdomain.com'] 
    : ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200 
}));


app.use(generalLimiter);


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));





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