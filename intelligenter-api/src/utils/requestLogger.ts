import type { Request, Response, NextFunction } from 'express';
import * as domainService from '../services/domainService.js';

export interface RequestWithTiming extends Request {
  startTime?: number;
  clientIp?: string;
}


export const requestLogger = (req: RequestWithTiming, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  req.startTime = startTime;

  
  const originalEnd = res.end.bind(res);
  
  res.end = (chunk?: any, encoding?: any, callback?: any) => {
    const endTime = Date.now();
    const responseTime = endTime - startTime;

 
    const requestData = {
      method: req.method,
      endpoint: req.originalUrl || req.url,
      headers: req.headers,
      query_params: req.query,
      body: req.body,
      ip_address: req.clientIp || 'unknown',
      user_agent: req.get('User-Agent') || '',
      status_code: res.statusCode,
      response_time_ms: responseTime,
      response_data: chunk ? (typeof chunk === 'string' ? chunk : JSON.stringify(chunk)) : null
    };

    
    domainService.logRequest(requestData).catch((error) => {
      console.error('Failed to log request:', error);
    });

    
    return originalEnd(chunk, encoding, callback);
  };

  next();
};


export const ipExtractor = (req: RequestWithTiming, res: Response, next: NextFunction): void => {
 
  req.clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 
                 req.headers['x-real-ip'] as string ||
                 req.socket.remoteAddress ||
                 'unknown';

  next();
};