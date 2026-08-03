import { body, param, query } from 'express-validator';
import { PROJECT_CATEGORIES } from '../models/project.model.js';

export const projectQueryValidation = [
  query('category')
    .optional()
    .isIn(PROJECT_CATEGORIES)
    .withMessage(`Category must be one of: ${PROJECT_CATEGORIES.join(', ')}`),
  query('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean value')
    .toBoolean(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be a positive integer between 1 and 100')
    .toInt(),
];

export const projectSlugValidation = [
  param('slug')
    .trim()
    .notEmpty()
    .withMessage('Project slug is required')
    .isSlug()
    .withMessage('Invalid slug format'),
];

export const projectIdValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Project ID is required')
    .isMongoId()
    .withMessage('Invalid Mongo ObjectId format'),
];

export const createProjectValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 120 })
    .withMessage('Title cannot exceed 120 characters'),

  body('slug')
    .optional({ values: 'falsy' })
    .trim()
    .isSlug()
    .withMessage('Invalid slug format'),

  body('category')
    .optional()
    .isIn(PROJECT_CATEGORIES)
    .withMessage(`Category must be one of: ${PROJECT_CATEGORIES.join(', ')}`),

  body('subtitle')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Subtitle cannot exceed 200 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),

  body('techStack')
    .optional()
    .isArray()
    .withMessage('techStack must be an array of strings'),

  body('githubUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('githubUrl must be a valid URL'),

  body('liveUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('liveUrl must be a valid URL'),

  body('coverImage')
    .optional()
    .trim(),

  body('galleryImages')
    .optional()
    .isArray()
    .withMessage('galleryImages must be an array of strings'),

  body('featured')
    .optional()
    .isBoolean()
    .withMessage('featured must be a boolean')
    .toBoolean(),

  body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be a boolean')
    .toBoolean(),

  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('order must be a non-negative integer')
    .toInt(),
];

export const updateProjectValidation = [
  ...projectIdValidation,

  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 120 })
    .withMessage('Title cannot exceed 120 characters'),

  body('slug')
    .optional({ values: 'falsy' })
    .trim()
    .isSlug()
    .withMessage('Invalid slug format'),

  body('category')
    .optional()
    .isIn(PROJECT_CATEGORIES)
    .withMessage(`Category must be one of: ${PROJECT_CATEGORIES.join(', ')}`),

  body('subtitle')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Subtitle cannot exceed 200 characters'),

  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description cannot be empty'),

  body('techStack')
    .optional()
    .isArray()
    .withMessage('techStack must be an array of strings'),

  body('githubUrl')
    .optional()
    .trim(),

  body('liveUrl')
    .optional()
    .trim(),

  body('coverImage')
    .optional()
    .trim(),

  body('galleryImages')
    .optional()
    .isArray()
    .withMessage('galleryImages must be an array of strings'),

  body('featured')
    .optional()
    .isBoolean()
    .withMessage('featured must be a boolean')
    .toBoolean(),

  body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be a boolean')
    .toBoolean(),

  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('order must be a non-negative integer')
    .toInt(),
];

export default {
  projectQueryValidation,
  projectSlugValidation,
  projectIdValidation,
  createProjectValidation,
  updateProjectValidation,
};