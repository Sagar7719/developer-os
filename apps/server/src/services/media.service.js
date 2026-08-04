import { mediaRepository } from '../repositories/media.repository.js';
import { cloudinaryProvider } from '../providers/cloudinary.provider.js';
import { MediaDTO } from '../dtos/media.dto.js';
import { MediaFolder } from '../constants/mediaFolder.js';
import ApiError from '../utils/apiError.js';
import { HttpStatus } from '../constants/httpStatus.js';

/**
 * MediaService — Layer 3: Business logic for Media asset management.
 * Decoupled from specific storage providers via clean provider interface.
 */
export class MediaService {
  /**
   * @param {Object} [storageProvider=cloudinaryProvider] - Storage provider instance implementing upload, delete, getUrl
   * @param {Object} [repository=mediaRepository] - Media data access repository
   */
  constructor(storageProvider = cloudinaryProvider, repository = mediaRepository) {
    this.storageProvider = storageProvider;
    this.mediaRepository = repository;
  }

  /**
   * Uploads file to storage provider and persists media metadata record in database.
   * @param {Object} params
   * @param {Object} params.file - Express Multer file object
   * @param {string} [params.folder=MediaFolder.GENERAL] - Target folder
   * @param {string} [params.userId=null] - ID of user creating asset
   * @returns {Promise<MediaDTO>}
   */
  async uploadMediaFile({ file, folder = MediaFolder.GENERAL, userId = null }) {
    if (!file || !file.buffer) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'No file buffer provided for upload.');
    }

    const targetFolder = Object.values(MediaFolder).includes(folder) ? folder : MediaFolder.GENERAL;

    // Stream upload file buffer to storage provider
    const uploadResult = await this.storageProvider.upload({
      fileBuffer: file.buffer,
      fileName: file.originalname,
      mimeType: file.mimetype,
      folder: targetFolder,
    });

    // Create database metadata record
    const mediaDoc = await this.mediaRepository.create({
      filename: file.originalname,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      folder: targetFolder,
      publicId: uploadResult.publicId,
      url: uploadResult.url,
      secureUrl: uploadResult.secureUrl,
      resourceType: uploadResult.resourceType || 'image',
      dimensions: {
        width: uploadResult.width,
        height: uploadResult.height,
      },
      createdBy: userId,
    });

    return MediaDTO.from(mediaDoc);
  }

  /**
   * Retrieves paginated list of active media assets.
   * @param {Object} options
   * @param {string} [options.folder]
   * @param {number} [options.page=1]
   * @param {number} [options.limit=20]
   * @returns {Promise<{ items: MediaDTO[], total: number, page: number, totalPages: number }>}
   */
  async getAllMedia({ folder, page = 1, limit = 20 } = {}) {
    const result = await this.mediaRepository.findAll({ folder, page, limit });
    return {
      items: MediaDTO.from(result.media),
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    };
  }

  /**
   * Retrieves single active media document by ID.
   * @param {string} id
   * @returns {Promise<MediaDTO>}
   */
  async getMediaById(id) {
    const mediaDoc = await this.mediaRepository.findById(id);
    if (!mediaDoc) {
      throw new ApiError(HttpStatus.NOT_FOUND, `Media asset with ID '${id}' was not found.`);
    }
    return MediaDTO.from(mediaDoc);
  }

  /**
   * Deletes media asset from storage provider and soft-deletes database metadata record.
   * @param {string} id
   * @param {string} [userId=null]
   * @returns {Promise<{ id: string, publicId: string, deleted: boolean }>}
   */
  async deleteMediaAsset(id, userId = null) {
    const mediaDoc = await this.mediaRepository.findById(id);
    if (!mediaDoc) {
      throw new ApiError(HttpStatus.NOT_FOUND, `Media asset with ID '${id}' was not found.`);
    }

    // Delete asset from storage provider
    await this.storageProvider.delete(mediaDoc.publicId, mediaDoc.resourceType);

    // Soft delete record in database
    await this.mediaRepository.softDeleteById(id, userId);

    return {
      id,
      publicId: mediaDoc.publicId,
      deleted: true,
    };
  }
}

export const mediaService = new MediaService();
export default mediaService;
