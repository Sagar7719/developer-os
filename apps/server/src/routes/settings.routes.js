import { Router } from 'express';
import SettingsController from '../controllers/settings.controller.js';
import { updateSettingsValidation } from '../validators/settings.validator.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { Roles } from '../constants/roles.js';

const router = Router();

// Public route to fetch sanitized site settings
router.get('/', SettingsController.getPublicSettings);

// Protected Admin routes
router.get('/admin', authenticate, authorize(Roles.ADMIN), SettingsController.getAdminSettings);
router.put('/', authenticate, authorize(Roles.ADMIN), updateSettingsValidation, SettingsController.updateSettings);

export default router;

