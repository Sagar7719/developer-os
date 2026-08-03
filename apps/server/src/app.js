import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import config from './config/env.config.js';
import { helmetMiddleware, corsMiddleware, rateLimiterMiddleware } from './middleware/security.middleware.js';
import notFoundHandler from './middleware/notFound.middleware.js';
import globalErrorHandler from './middleware/errorHandler.middleware.js';
import apiRouter from './routes/index.js';

const app = express();

// 1. Trust Proxy Configuration (for Nginx / Docker / Reverse Proxies / Load Balancers)
if (config.trustProxy || config.isProduction) {
  app.set('trust proxy', 1);
}

// 2. Security Headers (Helmet)
app.use(helmetMiddleware);

// 3. Payload Compression (Gzip)
app.use(compression());

// 4. CORS Policy
app.use(corsMiddleware);

// 5. Rate Limiting
app.use(rateLimiterMiddleware);

// 6. Cookie & Body Parsing Middlewares
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 7. Base API v1 Router Composition
app.use('/api/v1', apiRouter);

// 8. Catch-all 404 Handler for Unmapped Routes
app.use(notFoundHandler);

// 9. Global Centralized Error Handler Middleware
app.use(globalErrorHandler);

export default app;

