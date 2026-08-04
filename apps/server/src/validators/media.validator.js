import { body, query, param } from 'express-validator';
import { ALLOWED_MEDIA_FOLDERS } from '../constants/mediaFolder.js';
import validateRequest from '../middleware/validate.middleware.js';

/**
 * Validation rules for media upload requests.
 */
export const validateUploadMedia = [
  body('folder')
    .optional()
    .trim()
    .isIn(ALLOWED_MEDIA_FOLDERS)
    .withMessage(`Folder must be one of: ${ALLOWED_MEDIA_FOLDERS.join(', ')}`),
  validateRequest,
];

/**
 * Validation rules for retrieving paginated media items.
 */
export const validateGetMedia = [
  query('folder')
    .optional()
    .trim()
    .isIn(ALLOWED_MEDIA_FOLDERS)
    .withMessage(`Folder must be one of: ${ALLOWED_MEDIA_FOLDERS.join(', ')}`),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be an integer between 1 and 100'),
  validateRequest,
];

/**
 * Validation rules for requests containing media ID parameter.
 */
export const validateMediaIdParam = [
  param('id')
    .trim()
    .isMongoId()
    .withMessage('Invalid media resource ID format'),
  validateRequest,
];
