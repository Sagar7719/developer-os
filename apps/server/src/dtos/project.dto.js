/**
 * Project Data Transfer Object (DTO).
 * Sanitizes Project document payloads before returning API responses.
 */
export class ProjectDTO {
  /**
   * @param {Object} project - Mongoose Project document or raw object
   */
  constructor(project) {
    this.id = project._id ? project._id.toString() : project.id;
    this.title = project.title;
    this.slug = project.slug;
    this.category = project.category;
    this.subtitle = project.subtitle || '';
    this.description = project.description;
    this.techStack = project.techStack || [];
    this.githubUrl = project.githubUrl || '';
    this.liveUrl = project.liveUrl || '';
    this.coverImage = project.coverImage || '';
    this.galleryImages = project.galleryImages || [];
    this.featured = Boolean(project.featured);
    this.isPublished = Boolean(project.isPublished);
    this.order = project.order || 0;
    this.createdAt = project.createdAt;
    this.updatedAt = project.updatedAt;
  }

  /**
   * Transforms single document or list of documents to ProjectDTO(s).
   * @param {Object|Array} data
   * @returns {ProjectDTO|ProjectDTO[]|null}
   */
  static from(data) {
    if (!data) return null;
    if (Array.isArray(data)) {
      return data.map((item) => new ProjectDTO(item));
    }
    return new ProjectDTO(data);
  }
}

export default ProjectDTO;
