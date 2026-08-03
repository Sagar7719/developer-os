import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { contactController } from '../controllers/contact.controller.js';
import {
  createContactValidation,
  contactQueryValidation,
  contactIdValidation,
  updateContactStatusValidation,
} from '../validators/contact.validator.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { Roles } from '../constants/roles.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { ApiResponse } from '../utils/apiResponse.js';

const router = Router();

// Dedicated rate limiter for public contact submissions (5 requests per 15 minutes per IP)
const contactSubmissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(HttpStatus.TOO_MANY_REQUESTS).json(
      ApiResponse.error({
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: 'Too many contact form submissions from this IP address. Please try again after 15 minutes.',
      })
    );
  },
});

/**
 * Contact Routes — Layer 1: API Routing & Middleware binding
 */

// Public Contact Form Submission Endpoint
router.post(
  '/',
  contactSubmissionLimiter,
  createContactValidation,
  validateRequest,
  contactController.createContact
);

// Protected Admin Inbox CRUD Endpoints
router.get(
  '/',
  authenticate,
  authorize(Roles.ADMIN),
  contactQueryValidation,
  validateRequest,
  contactController.getContacts
);

router.get(
  '/:id',
  authenticate,
  authorize(Roles.ADMIN),
  contactIdValidation,
  validateRequest,
  contactController.getContactById
);

router.patch(
  '/:id/status',
  authenticate,
  authorize(Roles.ADMIN),
  updateContactStatusValidation,
  validateRequest,
  contactController.updateStatus
);

router.delete(
  '/:id',
  authenticate,
  authorize(Roles.ADMIN),
  contactIdValidation,
  validateRequest,
  contactController.deleteContact
);

export default router;
