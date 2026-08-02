import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { registerValidation, loginValidation } from '../validators/auth.validator.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * Auth Routes — Layer 1: Routing & Middleware composition
 */
router.post('/register', registerValidation, validateRequest, authController.register);
router.post('/login', loginValidation, validateRequest, authController.login);
router.post('/logout', authenticate, authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.get('/me', authenticate, authController.getMe);

export default router;
