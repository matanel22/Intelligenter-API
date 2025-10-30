import express from 'express';
import dotenv from 'dotenv';
import domainRoutes from './routes/domainRoutes.js';
import { requestLogger, ipExtractor } from './utils/requestLogger.js';
import { startScheduler } from './scheduler/scheduler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use(ipExtractor);
app.use(requestLogger);

// Routes
app.use('/api/domains', domainRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Intelligenter API is running' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Test database connection on startup (non-blocking)
(async () => {
  try {
    const { db } = await import('./db/knex.js');
    await db.raw('SELECT 1');
    console.log('✅ Database connection successful!');
    
    // Start scheduler after database connection is confirmed
    startScheduler();
  } catch (error) {
    console.error('❌ Database connection failed:', error instanceof Error ? error.message : String(error));
  }
})();

export default app;