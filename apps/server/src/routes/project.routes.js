import { Router } from 'express';
import { projectController } from '../controllers/project.controller.js';
import {
  projectQueryValidation,
  projectSlugValidation,
  projectIdValidation,
  createProjectValidation,
  updateProjectValidation,
} from '../validators/project.validator.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { Roles } from '../constants/roles.js';

const router = Router();

/**
 * Project Routes — Layer 1: API Routing & Middleware binding
 */

// Public Read Endpoints
router.get('/', projectQueryValidation, validateRequest, projectController.getProjects);
router.get('/:slug', projectSlugValidation, validateRequest, projectController.getProjectBySlug);

// Protected Admin CRUD Endpoints
router.post(
  '/',
  authenticate,
  authorize(Roles.ADMIN),
  createProjectValidation,
  validateRequest,
  projectController.createProject
);

router.put(
  '/:id',
  authenticate,
  authorize(Roles.ADMIN),
  updateProjectValidation,
  validateRequest,
  projectController.updateProject
);

router.delete(
  '/:id',
  authenticate,
  authorize(Roles.ADMIN),
  projectIdValidation,
  validateRequest,
  projectController.deleteProject
);

export default router;
