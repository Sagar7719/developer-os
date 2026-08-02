import { verifyAccessToken } from '../utils/jwt.util.js';
import { ApiError } from '../utils/apiError.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { ResponseMessages } from '../constants/responseMessages.js';

/**
 * Authentication Middleware.
 * Extracts Bearer token from Authorization header, verifies signature, and attaches req.user context.
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(HttpStatus.UNAUTHORIZED, ResponseMessages.UNAUTHORIZED));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch {
    return next(new ApiError(HttpStatus.UNAUTHORIZED, ResponseMessages.INVALID_TOKEN));
  }
};

export default authenticate;
