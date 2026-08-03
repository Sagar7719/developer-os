import { body, param, query } from 'express-validator';
import { SKILL_CATEGORIES } from '../models/skill.model.js';

export const skillQueryValidation = [
  query('category')
    .optional()
    .isIn(SKILL_CATEGORIES)
    .withMessage(`Category must be one of: ${SKILL_CATEGORIES.join(', ')}`),
  query('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean value')
    .toBoolean(),
];

export const skillIdValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Skill ID is required')
    .isMongoId()
    .withMessage('Invalid Mongo ObjectId format'),
];

export const createSkillValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(SKILL_CATEGORIES)
    .withMessage(`Category must be one of: ${SKILL_CATEGORIES.join(', ')}`),
  body('proficiency')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Proficiency must be an integer between 1 and 100')
    .toInt(),
  body('yearsOfExperience')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('yearsOfExperience must be a non-negative number')
    .toFloat(),
  body('icon')
    .optional()
    .trim(),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('featured must be a boolean')
    .toBoolean(),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('order must be a non-negative integer')
    .toInt(),
];

export const updateSkillValidation = [
  ...skillIdValidation,
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters'),
  body('category')
    .optional()
    .isIn(SKILL_CATEGORIES)
    .withMessage(`Category must be one of: ${SKILL_CATEGORIES.join(', ')}`),
  body('proficiency')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Proficiency must be an integer between 1 and 100')
    .toInt(),
  body('yearsOfExperience')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('yearsOfExperience must be a non-negative number')
    .toFloat(),
  body('icon')
    .optional()
    .trim(),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('featured must be a boolean')
    .toBoolean(),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('order must be a non-negative integer')
    .toInt(),
];

export default {
  skillQueryValidation,
  skillIdValidation,
  createSkillValidation,
  updateSkillValidation,
};
