import { Router } from 'express';
import aiController from '../controllers/ai.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { Roles } from '../constants/roles.js';
import { aiRateLimiterMiddleware } from '../middleware/security.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { generateAIValidation, getAILogsValidation } from '../validators/ai.validator.js';

const router = Router();

/**
 * AI Integration Layer Endpoints
 * Base Path: /api/v1/ai
 * Access: Restricted to authenticated ADMIN users
 */

router.post(
  '/generate',
  authenticate,
  authorize(Roles.ADMIN),
  aiRateLimiterMiddleware,
  generateAIValidation,
  validate,
  aiController.generateCompletion.bind(aiController)
);

router.post(
  '/stream',
  authenticate,
  authorize(Roles.ADMIN),
  aiRateLimiterMiddleware,
  generateAIValidation,
  validate,
  aiController.generateStream.bind(aiController)
);

router.get(
  '/logs',
  authenticate,
  authorize(Roles.ADMIN),
  getAILogsValidation,
  validate,
  aiController.getLogs.bind(aiController)
);

router.get(
  '/stats',
  authenticate,
  authorize(Roles.ADMIN),
  aiController.getStats.bind(aiController)
);

export default router;
