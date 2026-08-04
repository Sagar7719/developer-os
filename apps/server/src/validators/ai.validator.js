import { body, query } from 'express-validator';

const ALLOWED_PROMPT_TYPES = [
  'GENERATE_PROJECT_DESC',
  'SUMMARIZE_BLOG_POST',
  'OPTIMIZE_SEO',
  'SUGGEST_CONTACT_REPLY',
  'FREEFORM_ASSISTANT',
];

export const generateAIValidation = [
  body('promptType')
    .notEmpty()
    .withMessage('promptType is required')
    .isString()
    .withMessage('promptType must be a string')
    .isIn(ALLOWED_PROMPT_TYPES)
    .withMessage(`promptType must be one of: ${ALLOWED_PROMPT_TYPES.join(', ')}`),

  body('input')
    .notEmpty()
    .withMessage('input content is required')
    .isString()
    .withMessage('input must be a text string')
    .trim(),

  body('context')
    .optional()
    .isObject()
    .withMessage('context must be a key-value object'),

  body('temperature')
    .optional()
    .isFloat({ min: 0, max: 2 })
    .withMessage('temperature must be a number between 0 and 2'),

  body('maxTokens')
    .optional()
    .isInt({ min: 1, max: 4096 })
    .withMessage('maxTokens must be an integer between 1 and 4096'),
];

export const getAILogsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be between 1 and 100'),

  query('promptType')
    .optional()
    .isIn(ALLOWED_PROMPT_TYPES)
    .withMessage(`promptType must be one of: ${ALLOWED_PROMPT_TYPES.join(', ')}`),
];
