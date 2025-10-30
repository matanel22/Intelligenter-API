import type { Request, Response } from 'express';
import * as domainService from '../services/domainService.js';
import { validateDomain } from '../utils/validation.js';

// Create new domain
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

// Get all domains
export const getAllDomains = async (req: Request, res: Response): Promise<void> => {
  try {
    const domains = await domainService.getAllDomains();
    res.status(200).json({ success: true, data: domains });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch domains', details: error });
  }
};

// Get domain by ID
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

// Update domain
export const updateDomain = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'Domain ID is required' });
      return;
    }
    
    const validation = validateDomain(req.body);
    
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

// Delete domain
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

// Analyze domain
export const analyzeDomain = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'Domain ID is required' });
      return;
    }
    
    // Get domain by ID to get the domain name
    const domain = await domainService.getDomainById(parseInt(id));
    if (!domain) {
      res.status(404).json({ error: 'Domain not found' });
      return;
    }
    
    // Analyze domain using domain name
    const updatedDomain = await domainService.analyzeDomain(domain.domain);
    res.status(200).json({ success: true, data: updatedDomain });
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze domain', details: error });
  }
};

// Get domain status
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

// Step 3 - POST /post endpoint
export const postDomain = async (req: Request, res: Response): Promise<void> => {
  try {
    const { domain } = req.body;
    
    if (!domain || typeof domain !== 'string') {
      res.status(400).json({ error: 'Domain is required and must be a string' });
      return;
    }

    // Check if domain already exists
    const existingDomain = await domainService.getDomainByName(domain);
    
    if (existingDomain) {
      if (existingDomain.status === 'onAnalysis') {
        res.status(200).json({ 
          message: 'Domain is already being analyzed', 
          domain: existingDomain 
        });
        return;
      } else {
        // Domain exists but not in analysis - start new analysis
        const updatedDomain = await domainService.updateDomain(existingDomain.id!, { 
          status: 'onAnalysis' 
        });
        
        // Trigger analysis asynchronously
        setTimeout(async () => {
          await domainService.analyzeDomain(domain);
        }, 1000);
        
        res.status(200).json({ 
          message: 'Domain sent for analysis', 
          domain: updatedDomain 
        });
        return;
      }
    }

    // Create new domain with onAnalysis status
    const newDomain = await domainService.createDomain({
      domain,
      status: 'onAnalysis'
    });

    // Trigger analysis asynchronously
    setTimeout(async () => {
      await domainService.analyzeDomain(domain);
    }, 1000);

    res.status(201).json({ 
      message: 'Domain added and sent for analysis', 
      domain: newDomain 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process domain', details: error });
  }
};

// Step 3 - GET /get endpoint
export const getDomain = async (req: Request, res: Response): Promise<void> => {
  try {
    const { domain } = req.query;
    
    if (!domain || typeof domain !== 'string') {
      res.status(400).json({ error: 'Domain query parameter is required' });
      return;
    }

    // Check if domain exists
    const existingDomain = await domainService.getDomainByName(domain);
    
    if (existingDomain) {
      // Domain exists - return it
      res.status(200).json({ 
        success: true, 
        data: existingDomain 
      });
      return;
    }

    // Domain doesn't exist - add to analysis list
    const newDomain = await domainService.createDomain({
      domain,
      status: 'onAnalysis'
    });

    // Trigger analysis asynchronously
    setTimeout(async () => {
      await domainService.analyzeDomain(domain);
    }, 1000);

    res.status(201).json({ 
      success: true, 
      message: 'Domain added to analysis list', 
      data: newDomain 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get domain', details: error });
  }
};