import { Router } from 'express';
import healthRoutes from './health.routes.js';

const apiRouter = Router();

/**
 * Master API v1 Router composition.
 * Base path: /api/v1
 */
apiRouter.use('/health', healthRoutes);

export default apiRouter;
