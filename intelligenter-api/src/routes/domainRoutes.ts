import { Router } from 'express';
import * as domainController from '../controllers/domainController.js';

const router = Router();

// Step 3 - Basic REST API routes
router.post('/post', domainController.postDomain);
router.get('/get', domainController.getDomain);

// Original Domain routes (keeping for compatibility)
router.post('/', domainController.createDomain);
router.get('/', domainController.getAllDomains);
router.get('/:id', domainController.getDomainById);
router.put('/:id', domainController.updateDomain);
router.delete('/:id', domainController.deleteDomain);

// Domain analysis routes
router.post('/:id/analyze', domainController.analyzeDomain);
router.get('/:id/status', domainController.getDomainStatus);

export default router;