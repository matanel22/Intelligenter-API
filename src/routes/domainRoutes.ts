import { Router } from 'express';
import * as domainController from '../controllers/domainController.js';
import { validateBody, domainSchema, domainUpdateSchema, validateDomainParam } from '../middleware/validation.js';
import { createDomainLimiter, analysisLimiter } from '../middleware/rateLimiting.js';

const router = Router();


router.post('/post', createDomainLimiter, validateBody(domainSchema), domainController.postDomain);
router.get('/get', domainController.getDomain);


router.post('/', createDomainLimiter, validateBody(domainSchema), domainController.createDomain);
router.get('/', domainController.getAllDomains);
router.get('/:id', validateDomainParam, domainController.getDomainById);
router.put('/:id', validateDomainParam, validateBody(domainUpdateSchema), domainController.updateDomain);
router.delete('/:id', validateDomainParam, domainController.deleteDomain);

router.post('/:id/analyze', analysisLimiter, validateDomainParam, domainController.analyzeDomain);
router.get('/:id/status', validateDomainParam, domainController.getDomainStatus);

export default router;