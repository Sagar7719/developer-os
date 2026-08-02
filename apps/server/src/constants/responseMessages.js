/**
 * Application-wide generic API response messages.
 * Note: Domain-specific business messages must NOT be placed here.
 */
export const ResponseMessages = Object.freeze({
  SUCCESS: 'Operation completed successfully.',
  HEALTH_OK: 'Developer OS API Service is healthy and operational.',
  NOT_FOUND: 'The requested resource could not be found on this server.',
  INTERNAL_SERVER_ERROR: 'An unexpected internal server error occurred.',
  TOO_MANY_REQUESTS: 'Too many requests from this IP, please try again later.',
  VALIDATION_ERROR: 'Request validation failed due to invalid parameters.',
  DATABASE_CONNECTED: 'Database connection established successfully.',
  DATABASE_DISCONNECTED: 'Database disconnected.',
  DATABASE_ERROR: 'Database operation failed.',
});

export default ResponseMessages;
