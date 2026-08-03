import { body, param, query } from 'express-validator';
import { CONTACT_STATUS } from '../models/contact.model.js';

export const createContactValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters')
    .escape(),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ max: 200 })
    .withMessage('Subject cannot exceed 200 characters')
    .escape(),

  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 2000 })
    .withMessage('Message cannot exceed 2000 characters')
    .escape(),
];

export const contactQueryValidation = [
  query('status')
    .optional()
    .isIn(CONTACT_STATUS)
    .withMessage(`Status must be one of: ${CONTACT_STATUS.join(', ')}`),

  query('search')
    .optional()
    .trim(),
];

export const contactIdValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Contact ID is required')
    .isMongoId()
    .withMessage('Invalid Mongo ObjectId format'),
];

export const updateContactStatusValidation = [
  ...contactIdValidation,

  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .isIn(CONTACT_STATUS)
    .withMessage(`Status must be one of: ${CONTACT_STATUS.join(', ')}`),
];

export default {
  createContactValidation,
  contactQueryValidation,
  contactIdValidation,
  updateContactStatusValidation,
};
