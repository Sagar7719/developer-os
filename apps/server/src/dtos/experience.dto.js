/**
 * Experience Data Transfer Object (DTO).
 * Sanitizes Experience document payloads before returning API responses.
 */
export class ExperienceDTO {
  /**
   * @param {Object} experience - Mongoose Experience document or raw object
   */
  constructor(experience) {
    this.id = experience._id ? experience._id.toString() : experience.id;
    this.company = experience.company;
    this.role = experience.role;
    this.location = experience.location || '';
    this.startDate = experience.startDate;
    this.endDate = experience.endDate || null;
    this.isCurrent = Boolean(experience.isCurrent);
    this.description = experience.description;
    this.achievements = experience.achievements || [];
    this.techStack = experience.techStack || [];
    this.order = experience.order || 0;
    this.createdAt = experience.createdAt;
    this.updatedAt = experience.updatedAt;
  }

  /**
   * Transforms single document or list of documents to ExperienceDTO(s).
   * @param {Object|Array} data
   * @returns {ExperienceDTO|ExperienceDTO[]|null}
   */
  static from(data) {
    if (!data) return null;
    if (Array.isArray(data)) {
      return data.map((item) => new ExperienceDTO(item));
    }
    return new ExperienceDTO(data);
  }
}

export default ExperienceDTO;
