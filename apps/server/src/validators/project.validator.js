import { body, param, query } from 'express-validator';
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from '../models/project.model.js';

const ALLOWED_QUERY_STATUSES = Object.freeze([...PROJECT_STATUSES, 'all', 'deleted']);

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
  query('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured must be a boolean value')
    .toBoolean(),
  query('status')
    .optional()
    .isIn(ALLOWED_QUERY_STATUSES)
    .withMessage(`Status must be one of: ${ALLOWED_QUERY_STATUSES.join(', ')}`),
  query('search')
    .optional()
    .trim()
    .isString()
    .withMessage('Search query must be a string'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be a positive integer between 1 and 100')
    .toInt(),
  query('sortBy')
    .optional()
    .trim()
    .isString()
    .withMessage('Sort field must be a string'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc', '1', '-1'])
    .withMessage('Sort order must be asc, desc, 1, or -1'),
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

  body('longDescription')
    .optional()
    .trim(),

  body('techStack')
    .optional()
    .isArray()
    .withMessage('techStack must be an array of strings'),

  body('githubUrl')
    .optional({ values: 'falsy' })
    .trim()
    .isURL()
    .withMessage('githubUrl must be a valid URL'),

  body('liveUrl')
    .optional({ values: 'falsy' })
    .trim()
    .isURL()
    .withMessage('liveUrl must be a valid URL'),

  body('figmaUrl')
    .optional({ values: 'falsy' })
    .trim()
    .isURL()
    .withMessage('figmaUrl must be a valid URL'),

  body('coverImage')
    .optional()
    .trim(),

  body('coverImageMediaId')
    .optional({ values: 'falsy' })
    .isMongoId()
    .withMessage('Invalid coverImageMediaId format'),

  body('gallery')
    .optional()
    .isArray()
    .withMessage('gallery must be an array'),

  body('seo')
    .optional()
    .isObject()
    .withMessage('seo must be an object'),

  body('status')
    .optional()
    .isIn(PROJECT_STATUSES)
    .withMessage(`Status must be one of: ${PROJECT_STATUSES.join(', ')}`),

  body('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured must be a boolean')
    .toBoolean(),

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

  body('longDescription')
    .optional()
    .trim(),

  body('techStack')
    .optional()
    .isArray()
    .withMessage('techStack must be an array of strings'),

  body('githubUrl')
    .optional({ values: 'falsy' })
    .trim(),

  body('liveUrl')
    .optional({ values: 'falsy' })
    .trim(),

  body('figmaUrl')
    .optional({ values: 'falsy' })
    .trim(),

  body('coverImage')
    .optional()
    .trim(),

  body('coverImageMediaId')
    .optional({ values: 'falsy' })
    .isMongoId()
    .withMessage('Invalid coverImageMediaId format'),

  body('gallery')
    .optional()
    .isArray()
    .withMessage('gallery must be an array'),

  body('seo')
    .optional()
    .isObject()
    .withMessage('seo must be an object'),

  body('status')
    .optional()
    .isIn(PROJECT_STATUSES)
    .withMessage(`Status must be one of: ${PROJECT_STATUSES.join(', ')}`),

  body('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured must be a boolean')
    .toBoolean(),

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

export const reorderProjectsValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('items must be a non-empty array'),
  body('items.*.id')
    .isMongoId()
    .withMessage('Each item must have a valid Mongo ID'),
  body('items.*.order')
    .isInt({ min: 0 })
    .withMessage('Each item must have a non-negative order integer'),
];

export default {
  projectQueryValidation,
  projectSlugValidation,
  projectIdValidation,
  createProjectValidation,
  updateProjectValidation,
  reorderProjectsValidation,
};