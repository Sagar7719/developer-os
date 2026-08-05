import { validationResult } from 'express-validator';
import { ApiError } from '../utils/apiError.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { ResponseMessages } from '../constants/responseMessages.js';

/**
 * Middleware evaluating express-validator validation results.
 * Throws ApiError if validation constraints are violated.
 */
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {


    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));

    return next(
      new ApiError(
        HttpStatus.BAD_REQUEST,
        ResponseMessages.VALIDATION_ERROR,
        formattedErrors
      )
    );
  }
  next();
};


export default validateRequest;
