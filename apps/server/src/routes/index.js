import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';

const apiRouter = Router();

/**
 * Master API v1 Router composition.
 * Base path: /api/v1
 */
apiRouter.use('/health', healthRoutes);
apiRouter.use('/auth', authRoutes);

export default apiRouter;
