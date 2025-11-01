import type { Request, Response } from 'express';
import * as domainService from '../services/domainService.js';
import { validateDomain, validateDomainUpdate } from '../utils/validation.js';
import { queueAnalysis } from '../services/queueService.js';


export const createDomain = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = validateDomain(req.body);
    if (!validation.isValid) {
      res.status(400).json({ error: 'Invalid domain data', details: validation.errors });
      return;
    }

    const domain = await domainService.createDomain(req.body);
    res.status(201).json({ success: true, data: domain });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create domain', details: error });
  }
};


export const getAllDomains = async (req: Request, res: Response): Promise<void> => {
  try {
    const domains = await domainService.getAllDomains();
    res.status(200).json({ success: true, data: domains });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch domains', details: error });
  }
};


export const getDomainById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'Domain ID is required' });
      return;
    }
    
    const domain = await domainService.getDomainById(parseInt(id));
    
    if (!domain) {
      res.status(404).json({ error: 'Domain not found' });
      return;
    }

    res.status(200).json({ success: true, data: domain });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch domain', details: error });
  }
};


export const updateDomain = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'Domain ID is required' });
      return;
    }
    
    const validation = validateDomainUpdate(req.body);
    
    if (!validation.isValid) {
      res.status(400).json({ error: 'Invalid domain data', details: validation.errors });
      return;
    }

    const domain = await domainService.updateDomain(parseInt(id), req.body);
    res.status(200).json({ success: true, data: domain });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update domain', details: error });
  }
};


export const deleteDomain = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'Domain ID is required' });
      return;
    }
    
    await domainService.deleteDomain(parseInt(id));
    res.status(200).json({ success: true, message: 'Domain deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete domain', details: error });
  }
};


export const analyzeDomain = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'Domain ID is required' });
      return;
    }
    
   
    const domain = await domainService.getDomainById(parseInt(id));
    if (!domain) {
      res.status(404).json({ error: 'Domain not found' });
      return;
    }
    
  
    const updatedDomain = await domainService.analyzeDomain(domain.domain);
    res.status(200).json({ success: true, data: updatedDomain });
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze domain', details: error });
  }
};


export const getDomainStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'Domain ID is required' });
      return;
    }
    
    const status = await domainService.getDomainStatus(parseInt(id));
    res.status(200).json({ success: true, data: status });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get domain status', details: error });
  }
};


export const postDomain = async (req: Request, res: Response): Promise<void> => {
  try {
    const { domain } = req.body;
    
    if (!domain || typeof domain !== 'string') {
      res.status(400).json({ error: 'Domain is required and must be a string' });
      return;
    }

   
    const existingDomain = await domainService.getDomainByName(domain);
    
    if (existingDomain) {
      if (existingDomain.status === 'onAnalysis') {
        res.status(200).json({ 
          message: 'Domain is already being analyzed', 
          domain: existingDomain 
        });
        return;
      } else {
       
        const updatedDomain = await domainService.updateDomain(existingDomain.id!, { 
          status: 'onAnalysis' 
        });
        
        // Queue analysis for background processing
        await queueAnalysis(domain);
        
        res.status(200).json({ 
          message: 'Domain sent for analysis', 
          domain: updatedDomain 
        });
        return;
      }
    }

   
    const newDomain = await domainService.createDomain({
      domain,
      status: 'onAnalysis'
    });

    // Queue analysis for background processing
    await queueAnalysis(domain);

    res.status(201).json({ 
      message: 'Domain added and sent for analysis', 
      domain: newDomain 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process domain', details: error });
  }
};


export const getDomain = async (req: Request, res: Response): Promise<void> => {
  try {
    const { domain } = req.query;
    
    if (!domain || typeof domain !== 'string') {
      res.status(400).json({ error: 'Domain query parameter is required' });
      return;
    }

  
    const existingDomain = await domainService.getDomainByName(domain);
    
    if (existingDomain) {
    
      res.status(200).json({ 
        success: true, 
        data: existingDomain 
      });
      return;
    }

 
    const newDomain = await domainService.createDomain({
      domain,
      status: 'onAnalysis'
    });

    // Queue analysis for background processing
    await queueAnalysis(domain);

    res.status(201).json({ 
      success: true, 
      message: 'Domain added to analysis list', 
      data: newDomain 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get domain', details: error });
  }
};