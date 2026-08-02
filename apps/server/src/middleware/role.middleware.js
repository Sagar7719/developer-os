import { ApiError } from '../utils/apiError.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { ResponseMessages } from '../constants/responseMessages.js';

/**
 * Role-Based Access Control (RBAC) Authorization Middleware.
 * @param {...string} allowedRoles - List of permitted roles (from Roles constant)
 * @returns {Function} Express middleware function
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(HttpStatus.UNAUTHORIZED, ResponseMessages.UNAUTHORIZED));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(HttpStatus.FORBIDDEN, ResponseMessages.FORBIDDEN));
    }

    next();
  };
};

export default authorize;
