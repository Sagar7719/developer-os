import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import config from '../config/env.config.js';
import logger from '../config/logger.js';
import ApiError from '../utils/apiError.js';
import { HttpStatus } from '../constants/httpStatus.js';

/**
 * Cloudinary Storage Provider — Implements Provider Interface for Storage operations.
 * Exposes clean methods: upload, delete, getUrl.
 */
export class CloudinaryProvider {
  constructor() {
    this.initClient();
  }

  /**
   * Initializes Cloudinary configuration from server environment variables.
   */
  initClient() {
    if (config.cloudinaryCloudName && config.cloudinaryApiKey && config.cloudinaryApiSecret) {
      cloudinary.config({
        cloud_name: config.cloudinaryCloudName,
        api_key: config.cloudinaryApiKey,
        api_secret: config.cloudinaryApiSecret,
        secure: true,
      });
    }
  }

  /**
   * Validates that all required Cloudinary credentials exist in configuration.
   * Throws explicit configuration ApiError if missing.
   */
  validateCredentials() {
    if (!config.cloudinaryCloudName || !config.cloudinaryApiKey || !config.cloudinaryApiSecret) {
      throw new ApiError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Cloudinary configuration error: Missing CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, or CLOUDINARY_API_SECRET in server environment settings.'
      );
    }
    // Re-verify config in case env changed dynamically
    cloudinary.config({
      cloud_name: config.cloudinaryCloudName,
      api_key: config.cloudinaryApiKey,
      api_secret: config.cloudinaryApiSecret,
      secure: true,
    });
  }

  /**
   * Uploads a file buffer directly to Cloudinary storage.
   * @param {Object} params
   * @param {Buffer} params.fileBuffer - Raw file buffer from Multer memory storage
   * @param {string} [params.fileName] - Original file name for reference
   * @param {string} [params.mimeType] - MIME type of the upload
   * @param {string} params.folder - Destination media folder
   * @returns {Promise<{ publicId: string, url: string, secureUrl: string, format: string, bytes: number, width: number|null, height: number|null, resourceType: string }>}
   */
  async upload({ fileBuffer, fileName, mimeType, folder }) {
    this.validateCredentials();

    if (!fileBuffer || !Buffer.isBuffer(fileBuffer)) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Invalid or missing file buffer for upload.');
    }

    return new Promise((resolve, reject) => {
      const uploadOptions = {
        folder: folder || 'general',
        resource_type: 'auto',
      };

      if (fileName) {
        // Strip extension for Cloudinary public_id hint
        const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
        uploadOptions.public_id = `${nameWithoutExt}_${Date.now()}`;
      }

      const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) {
          logger.error(`[CloudinaryProvider.upload] Cloudinary upload error: ${error.message}`, { error });
          return reject(
            new ApiError(HttpStatus.BAD_GATEWAY, `Cloudinary storage upload error: ${error.message}`)
          );
        }

        resolve({
          publicId: result.public_id,
          url: result.url,
          secureUrl: result.secure_url,
          format: result.format || (mimeType ? mimeType.split('/')[1] : ''),
          bytes: result.bytes,
          width: result.width || null,
          height: result.height || null,
          resourceType: result.resource_type || 'image',
        });
      });

      Readable.from(fileBuffer).pipe(stream);
    });
  }

  /**
   * Deletes an asset from Cloudinary storage by public ID.
   * @param {string} publicId - Cloudinary public ID of the asset
   * @param {string} [resourceType='image'] - Cloudinary resource type ('image', 'raw', 'video')
   * @returns {Promise<{ result: string }>}
   */
  async delete(publicId, resourceType = 'image') {
    this.validateCredentials();

    if (!publicId) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Public ID is required to delete media from storage provider.');
    }

    try {
      const response = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
        invalidate: true,
      });

      return { result: response.result || 'ok' };
    } catch (error) {
      logger.error(`[CloudinaryProvider.delete] Error destroying asset ${publicId}: ${error.message}`, { error });
      throw new ApiError(
        HttpStatus.BAD_GATEWAY,
        `Cloudinary storage delete error: ${error.message}`
      );
    }
  }

  /**
   * Generates a public URL for a given public ID with optional transformation parameters.
   * @param {string} publicId
   * @param {Object} [options={}]
   * @returns {string}
   */
  getUrl(publicId, options = {}) {
    this.validateCredentials();
    return cloudinary.url(publicId, {
      secure: true,
      ...options,
    });
  }
}

export const cloudinaryProvider = new CloudinaryProvider();
export default cloudinaryProvider;
