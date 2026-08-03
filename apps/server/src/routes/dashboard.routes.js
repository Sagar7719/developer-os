import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller.js';

const router = Router();

/**
 * Dashboard Routes — Layer 1: API Routing & Middleware binding
 */

// Public Read Endpoint for System Statistics (consumed by Hero & Admin Dashboard)
router.get('/stats', dashboardController.getStats);

export default router;
