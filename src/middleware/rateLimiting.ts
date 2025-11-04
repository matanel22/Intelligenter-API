import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';


export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: {
    error: 'Too many requests',
    message: 'You have exceeded the 100 requests in 15 minutes limit!',
    retryAfter: Math.round(15 * 60 * 1000 / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false, 
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Too many requests',
      message: 'You have exceeded the 100 requests in 15 minutes limit!',
      retryAfter: Math.round(15 * 60 * 1000 / 1000)
    });
  }
});


export const analysisLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 20, 
  message: {
    error: 'Analysis rate limit exceeded',
    message: 'Too many analysis requests. Please try again in 10 minutes.',
    retryAfter: Math.round(10 * 60 * 1000 / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Analysis rate limit exceeded',
      message: 'Too many analysis requests. Please try again in 10 minutes.',
      retryAfter: Math.round(10 * 60 * 1000 / 1000)
    });
  }
});


export const createDomainLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  message: {
    error: 'Domain creation limit exceeded',
    message: 'Too many domains created. Please try again in 1 hour.',
    retryAfter: Math.round(60 * 60 * 1000 / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, 
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Domain creation limit exceeded',
      message: 'Too many domains created. Please try again in 1 hour.',
      retryAfter: Math.round(60 * 60 * 1000 / 1000)
    });
  }
});