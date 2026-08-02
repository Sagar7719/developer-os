import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from '../config/env.config.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { ResponseMessages } from '../constants/responseMessages.js';
import { ApiResponse } from '../utils/apiResponse.js';

// Helmet Security Headers Configuration
export const helmetMiddleware = helmet();

// Dynamic CORS Configuration
export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. Postman, curl, server-to-server) or matching origins
    if (!origin || origin === config.clientOrigin || config.isDevelopment) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy violation: Origin ${origin} is not allowed.`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
});

// Rate Limiting Security Configuration
export const rateLimiterMiddleware = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(HttpStatus.TOO_MANY_REQUESTS).json(
      ApiResponse.error({
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: ResponseMessages.TOO_MANY_REQUESTS,
      })
    );
  },
});

export default {
  helmetMiddleware,
  corsMiddleware,
  rateLimiterMiddleware,
};
