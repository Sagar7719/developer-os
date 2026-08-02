import { logger } from '../config/logger.js';
import { config } from '../config/env.config.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { ResponseMessages } from '../constants/responseMessages.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

/**
 * Global Express Error Handling Middleware.
 */
// eslint-disable-next-line no-unused-vars
export const globalErrorHandler = (err, req, res, next) => {
  let error = err;

  // Convert non-ApiError instances into operational ApiErrors
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || ResponseMessages.INTERNAL_SERVER_ERROR;
    error = new ApiError(statusCode, message, [], err.stack);
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid ${err.path}: ${err.value}`;
    error = new ApiError(HttpStatus.BAD_REQUEST, message);
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const message = `Duplicate value entered for ${Object.keys(err.keyValue).join(', ')} field.`;
    error = new ApiError(HttpStatus.CONFLICT, message);
  }

  // Log error via Winston logger
  logger.error(`[Error] ${req.method} ${req.originalUrl} - ${error.statusCode} - ${error.message}`, {
    stack: error.stack,
    errors: error.errors,
  });

  const statusCode = error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
  const message = error.message || ResponseMessages.INTERNAL_SERVER_ERROR;
  const errors = error.errors || null;
  const stack = config.isDevelopment ? error.stack : null;

  return res.status(statusCode).json(
    ApiResponse.error({
      statusCode,
      message,
      errors,
      stack,
    })
  );
};

export default globalErrorHandler;
