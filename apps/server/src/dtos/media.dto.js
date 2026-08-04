/**
 * Media Data Transfer Object (DTO).
 * Sanitizes Media document payloads before returning API responses.
 */
export class MediaDTO {
  /**
   * @param {Object} media - Mongoose Media document or raw object
   */
  constructor(media) {
    this.id = media._id ? media._id.toString() : media.id;
    this.filename = media.filename;
    this.originalName = media.originalName;
    this.mimeType = media.mimeType;
    this.size = media.size;
    this.folder = media.folder;
    this.publicId = media.publicId;
    this.url = media.url;
    this.secureUrl = media.secureUrl;
    this.resourceType = media.resourceType || 'image';
    this.dimensions = media.dimensions || { width: null, height: null };
    this.createdBy = media.createdBy
      ? typeof media.createdBy === 'object'
        ? {
            id: media.createdBy._id ? media.createdBy._id.toString() : media.createdBy.id,
            name: media.createdBy.name,
            email: media.createdBy.email,
          }
        : media.createdBy
      : null;
    this.createdAt = media.createdAt;
    this.updatedAt = media.updatedAt;
  }

  /**
   * Transforms single document or list of documents to MediaDTO(s).
   * @param {Object|Array} data
   * @returns {MediaDTO|MediaDTO[]|null}
   */
  static from(data) {
    if (!data) return null;
    if (Array.isArray(data)) {
      return data.map((item) => new MediaDTO(item));
    }
    return new MediaDTO(data);
  }
}

export default MediaDTO;
