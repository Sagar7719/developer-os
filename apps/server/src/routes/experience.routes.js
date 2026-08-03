import { Router } from 'express';
import { experienceController } from '../controllers/experience.controller.js';
import {
  experienceIdValidation,
  createExperienceValidation,
  updateExperienceValidation,
} from '../validators/experience.validator.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { Roles } from '../constants/roles.js';

const router = Router();

/**
 * Experience Routes — Layer 1: API Routing & Middleware binding
 */

// Public Read Endpoints
router.get('/', experienceController.getExperiences);

// Protected Admin CRUD Endpoints
router.post(
  '/',
  authenticate,
  authorize(Roles.ADMIN),
  createExperienceValidation,
  validateRequest,
  experienceController.createExperience
);

router.put(
  '/:id',
  authenticate,
  authorize(Roles.ADMIN),
  updateExperienceValidation,
  validateRequest,
  experienceController.updateExperience
);

router.delete(
  '/:id',
  authenticate,
  authorize(Roles.ADMIN),
  experienceIdValidation,
  validateRequest,
  experienceController.deleteExperience
);

export default router;
