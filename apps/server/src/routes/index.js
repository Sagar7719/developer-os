import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import projectRoutes from './project.routes.js';
import skillRoutes from './skill.routes.js';
import experienceRoutes from './experience.routes.js';

const apiRouter = Router();

/**
 * Master API v1 Router composition.
 * Base path: /api/v1
 */
apiRouter.use('/health', healthRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/projects', projectRoutes);
apiRouter.use('/skills', skillRoutes);
apiRouter.use('/experience', experienceRoutes);

export default apiRouter;
