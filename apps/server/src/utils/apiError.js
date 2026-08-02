import { HttpStatus } from '../constants/httpStatus.js';

/**
 * Custom Operational API Error class for standardizing error handling.
 */
export class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {Array} [errors=[]] - Array of specific error details/validation errors
   * @param {string} [stack=''] - Optional stack trace override
   */
  constructor(statusCode = HttpStatus.INTERNAL_SERVER_ERROR, message = 'An unexpected error occurred.', errors = [], stack = '') {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
