import { Router } from 'express';
import { healthController } from '../controllers/health.controller.js';

const router = Router();

/**
 * Health Routes — Layer 1: API path routing.
 * Single route: GET /api/v1/health
 */
router.get('/', healthController.getHealth);

export default router;
