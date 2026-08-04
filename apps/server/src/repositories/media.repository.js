import { Media } from '../models/media.model.js';

/**
 * MediaRepository — Layer 4: Data Access abstraction for Media entity.
 */
export class MediaRepository {
  /**
   * Create a new Media document.
   * @param {Object} mediaData
   * @returns {Promise<import('mongoose').Document>}
   */
  async create(mediaData) {
    const media = new Media(mediaData);
    return media.save();
  }

  /**
   * Find Media document by ID.
   * @param {string} id
   * @param {boolean} [includeDeleted=false]
   * @returns {Promise<import('mongoose').Document|null>}
   */
  async findById(id, includeDeleted = false) {
    const filter = { _id: id };
    if (!includeDeleted) {
      filter.isDeleted = false;
    }
    return Media.findOne(filter).populate('createdBy', 'name email avatar').exec();
  }

  /**
   * Find Media document by public ID.
   * @param {string} publicId
   * @returns {Promise<import('mongoose').Document|null>}
   */
  async findByPublicId(publicId) {
    return Media.findOne({ publicId, isDeleted: false }).exec();
  }

  /**
   * Find all media documents with optional filtering and pagination.
   * @param {Object} options
   * @param {string} [options.folder]
   * @param {boolean} [options.isDeleted=false]
   * @param {number} [options.page=1]
   * @param {number} [options.limit=20]
   * @returns {Promise<{ media: import('mongoose').Document[], total: number, page: number, totalPages: number }>}
   */
  async findAll({ folder, isDeleted = false, page = 1, limit = 20 } = {}) {
    const filter = { isDeleted };
    if (folder) {
      filter.folder = folder;
    }

    const numericPage = Math.max(1, parseInt(page, 10) || 1);
    const numericLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const skip = (numericPage - 1) * numericLimit;

    const [media, total] = await Promise.all([
      Media.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(numericLimit)
        .populate('createdBy', 'name email avatar')
        .exec(),
      Media.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / numericLimit) || 1;

    return {
      media,
      total,
      page: numericPage,
      totalPages,
    };
  }

  /**
   * Soft delete Media document by ID.
   * Sets isDeleted = true and records deletedAt timestamp.
   * @param {string} id
   * @returns {Promise<import('mongoose').Document|null>}
   */
  async softDeleteById(id) {
    return Media.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    ).exec();
  }

  /**
   * Permanently hard delete Media document by ID.
   * @param {string} id
   * @returns {Promise<import('mongoose').Document|null>}
   */
  async hardDeleteById(id) {
    return Media.findByIdAndDelete(id).exec();
  }
}

export const mediaRepository = new MediaRepository();
export default mediaRepository;
