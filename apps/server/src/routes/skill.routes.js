import { Router } from 'express';
import { skillController } from '../controllers/skill.controller.js';
import {
  skillQueryValidation,
  skillIdValidation,
  createSkillValidation,
  updateSkillValidation,
} from '../validators/skill.validator.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { Roles } from '../constants/roles.js';

const router = Router();

/**
 * Skill Routes — Layer 1: API Routing & Middleware binding
 */

// Public Read Endpoints
router.get('/', skillQueryValidation, validateRequest, skillController.getSkills);

// Protected Admin CRUD Endpoints
router.post(
  '/',
  authenticate,
  authorize(Roles.ADMIN),
  createSkillValidation,
  validateRequest,
  skillController.createSkill
);

router.put(
  '/:id',
  authenticate,
  authorize(Roles.ADMIN),
  updateSkillValidation,
  validateRequest,
  skillController.updateSkill
);

router.delete(
  '/:id',
  authenticate,
  authorize(Roles.ADMIN),
  skillIdValidation,
  validateRequest,
  skillController.deleteSkill
);

export default router;
