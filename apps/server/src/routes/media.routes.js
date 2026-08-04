import { Router } from 'express';
import { mediaController } from '../controllers/media.controller.js';
import { handleSingleUpload } from '../middleware/upload.middleware.js';
import {
  validateUploadMedia,
  validateGetMedia,
  validateMediaIdParam,
} from '../validators/media.validator.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { Roles } from '../constants/roles.js';

const router = Router();

/**
 * Media Routes — Layer 1: API Routing & Middleware binding
 * Base Path: /api/v1/media
 */

// POST /api/v1/media/upload — Upload single file to Cloudinary storage
router.post(
  '/upload',
  authenticate,
  authorize(Roles.ADMIN),
  handleSingleUpload('file'),
  validateUploadMedia,
  mediaController.uploadMedia
);

// GET /api/v1/media — Retrieve paginated list of media items
router.get(
  '/',
  authenticate,
  authorize(Roles.ADMIN),
  validateGetMedia,
  mediaController.getAllMedia
);

// GET /api/v1/media/:id — Retrieve single media item by ID
router.get(
  '/:id',
  authenticate,
  authorize(Roles.ADMIN),
  validateMediaIdParam,
  mediaController.getMediaById
);

// DELETE /api/v1/media/:id — Delete media item from Cloudinary and soft-delete record
router.delete(
  '/:id',
  authenticate,
  authorize(Roles.ADMIN),
  validateMediaIdParam,
  mediaController.deleteMedia
);

export default router;
