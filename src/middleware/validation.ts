import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';


export const domainSchema = Joi.object({
  domain: Joi.string()
    .domain()
    .required()
    .messages({
      'string.domain': 'Please provide a valid domain name',
      'any.required': 'Domain is required'
    }),
  status: Joi.string()
    .valid('onAnalysis', 'ready')
    .optional()
    .default('onAnalysis')
});


export const domainUpdateSchema = Joi.object({
  domain: Joi.string()
    .domain()
    .optional(),
  status: Joi.string()
    .valid('onAnalysis', 'ready')
    .optional()
});


export const validateBody = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, 
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

   
    req.body = value;
    next();
  };
};


export const validateDomainParam = (req: Request, res: Response, next: NextFunction) => {
  const idParam = req.params.id;
  
  if (!idParam) {
    return res.status(400).json({
      error: 'Domain ID is required',
      details: 'Please provide a domain ID in the URL'
    });
  }
  
  const domainId = parseInt(idParam);
  
  if (isNaN(domainId) || domainId <= 0) {
    return res.status(400).json({
      error: 'Invalid domain ID',
      details: 'Domain ID must be a positive integer'
    });
  }

  next();
};