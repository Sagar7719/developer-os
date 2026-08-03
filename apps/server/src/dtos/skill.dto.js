/**
 * Skill Data Transfer Object (DTO).
 * Sanitizes Skill document payloads before returning API responses.
 */
export class SkillDTO {
  /**
   * @param {Object} skill - Mongoose Skill document or raw object
   */
  constructor(skill) {
    this.id = skill._id ? skill._id.toString() : skill.id;
    this.name = skill.name;
    this.category = skill.category;
    this.proficiency = skill.proficiency;
    this.yearsOfExperience = skill.yearsOfExperience;
    this.icon = skill.icon || '';
    this.featured = Boolean(skill.featured);
    this.order = skill.order || 0;
    this.createdAt = skill.createdAt;
    this.updatedAt = skill.updatedAt;
  }

  /**
   * Transforms single document or list of documents to SkillDTO(s).
   * @param {Object|Array} data
   * @returns {SkillDTO|SkillDTO[]|null}
   */
  static from(data) {
    if (!data) return null;
    if (Array.isArray(data)) {
      return data.map((item) => new SkillDTO(item));
    }
    return new SkillDTO(data);
  }
}

export default SkillDTO;
