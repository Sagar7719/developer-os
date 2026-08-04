import multer from 'multer';
import config from '../config/env.config.js';
import ApiError from '../utils/apiError.js';
import { HttpStatus } from '../constants/httpStatus.js';

// Memory storage engine — files are stored in memory as Buffer objects for Cloudinary streaming
const storage = multer.memoryStorage();

// Allowed MIME types map
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
  'video/mp4',
  'video/webm',
]);

/**
 * Custom Multer file filter validating file MIME types.
 */
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        HttpStatus.BAD_REQUEST,
        `Unsupported file type '${file.mimetype}'. Allowed types: JPEG, PNG, WEBP, GIF, SVG, PDF, MP4, WEBM.`
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: (config.maxFileSizeMb || 10) * 1024 * 1024,
  },
  fileFilter,
});

/**
 * Middleware wrapper for single file upload field with error handling for Multer exceptions.
 * @param {string} fieldName - Form field name containing file
 */
export const handleSingleUpload = (fieldName = 'file') => {
  return (req, res, next) => {
    const uploadSingle = upload.single(fieldName);

    uploadSingle(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return next(
              new ApiError(
                HttpStatus.BAD_REQUEST,
                `File size exceeds maximum permitted limit of ${config.maxFileSizeMb || 10} MB.`
              )
            );
          }
          return next(new ApiError(HttpStatus.BAD_REQUEST, `Upload error: ${err.message}`));
        }
        return next(err);
      }

      if (!req.file) {
        return next(new ApiError(HttpStatus.BAD_REQUEST, 'No file was provided in the upload request.'));
      }

      next();
    });
  };
};

export default handleSingleUpload;
