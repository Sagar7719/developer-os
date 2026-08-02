import express from 'express';
import { helmetMiddleware, corsMiddleware, rateLimiterMiddleware } from './middleware/security.middleware.js';
import notFoundHandler from './middleware/notFound.middleware.js';
import globalErrorHandler from './middleware/errorHandler.middleware.js';
import apiRouter from './routes/index.js';

const app = express();

// Security Middlewares
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(rateLimiterMiddleware);

// Body Parsing Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Base API v1 Router Composition
app.use('/api/v1', apiRouter);

// Catch-all 404 Handler for Unmapped Routes
app.use(notFoundHandler);

// Global Centralized Error Handler Middleware
app.use(globalErrorHandler);

export default app;
