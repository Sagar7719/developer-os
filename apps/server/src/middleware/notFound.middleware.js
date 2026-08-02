import { ApiError } from '../utils/apiError.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { ResponseMessages } from '../constants/responseMessages.js';

/**
 * Express middleware to handle unmapped 404 routes.
 */
export const notFoundHandler = (req, res, next) => {
  const error = new ApiError(
    HttpStatus.NOT_FOUND,
    `${ResponseMessages.NOT_FOUND} Path: ${req.originalUrl}`
  );
  next(error);
};

export default notFoundHandler;
