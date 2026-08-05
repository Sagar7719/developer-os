import { Router } from 'express';
import { projectController } from '../controllers/project.controller.js';
import {
  projectQueryValidation,
  projectSlugValidation,
  projectIdValidation,
  createProjectValidation,
  updateProjectValidation,
  reorderProjectsValidation,
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

// Protected Admin Management Endpoints
router.get(
  '/admin/all',
  authenticate,
  authorize(Roles.ADMIN),
  projectQueryValidation,
  validateRequest,
  projectController.getAdminProjects
);

router.post(
  '/',
  authenticate,
  authorize(Roles.ADMIN),
  createProjectValidation,
  validateRequest,
  projectController.createProject
);

router.put(
  '/reorder',
  authenticate,
  authorize(Roles.ADMIN),
  reorderProjectsValidation,
  validateRequest,
  projectController.reorderProjects
);

router.put(
  '/:id',
  authenticate,
  authorize(Roles.ADMIN),
  updateProjectValidation,
  validateRequest,
  projectController.updateProject
);

router.patch(
  '/:id/status',
  authenticate,
  authorize(Roles.ADMIN),
  projectIdValidation,
  validateRequest,
  projectController.updateProjectStatus
);

router.patch(
  '/:id/featured',
  authenticate,
  authorize(Roles.ADMIN),
  projectIdValidation,
  validateRequest,
  projectController.updateProjectFeatured
);

router.patch(
  '/:id/restore',
  authenticate,
  authorize(Roles.ADMIN),
  projectIdValidation,
  validateRequest,
  projectController.restoreProject
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

