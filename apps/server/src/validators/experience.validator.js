import { body, param } from 'express-validator';

export const experienceIdValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Experience ID is required')
    .isMongoId()
    .withMessage('Invalid Mongo ObjectId format'),
];

export const createExperienceValidation = [
  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company is required')
    .isLength({ max: 100 })
    .withMessage('Company cannot exceed 100 characters'),
  body('role')
    .trim()
    .notEmpty()
    .withMessage('Role is required')
    .isLength({ max: 100 })
    .withMessage('Role cannot exceed 100 characters'),
  body('location')
    .optional()
    .trim(),
  body('startDate')
    .notEmpty()
    .withMessage('startDate is required')
    .isISO8601()
    .withMessage('startDate must be a valid ISO 8601 date string')
    .toDate(),
  body('endDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('endDate must be a valid ISO 8601 date string')
    .toDate(),
  body('isCurrent')
    .optional()
    .isBoolean()
    .withMessage('isCurrent must be a boolean')
    .toBoolean(),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  body('achievements')
    .optional()
    .isArray()
    .withMessage('achievements must be an array of strings'),
  body('techStack')
    .optional()
    .isArray()
    .withMessage('techStack must be an array of strings'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('order must be a non-negative integer')
    .toInt(),
];

export const updateExperienceValidation = [
  ...experienceIdValidation,
  body('company')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Company cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Company cannot exceed 100 characters'),
  body('role')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Role cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Role cannot exceed 100 characters'),
  body('location')
    .optional()
    .trim(),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('startDate must be a valid ISO 8601 date string')
    .toDate(),
  body('endDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('endDate must be a valid ISO 8601 date string')
    .toDate(),
  body('isCurrent')
    .optional()
    .isBoolean()
    .withMessage('isCurrent must be a boolean')
    .toBoolean(),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description cannot be empty'),
  body('achievements')
    .optional()
    .isArray()
    .withMessage('achievements must be an array of strings'),
  body('techStack')
    .optional()
    .isArray()
    .withMessage('techStack must be an array of strings'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('order must be a non-negative integer')
    .toInt(),
];

export default {
  experienceIdValidation,
  createExperienceValidation,
  updateExperienceValidation,
};
