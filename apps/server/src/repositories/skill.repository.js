import { Skill } from '../models/skill.model.js';

/**
 * SkillRepository — Layer 4: Data Access abstraction for Skill entity.
 */
export class SkillRepository {
  /**
   * Find all non-deleted skills with optional filtering options.
   * @param {Object} options
   * @param {string} [options.category]
   * @param {boolean} [options.featured]
   * @returns {Promise<import('mongoose').Document[]>}
   */
  async findAll({ category, featured } = {}) {
    const filter = { isDeleted: false };

    if (category) {
      filter.category = category;
    }
    if (featured !== undefined && featured !== null) {
      filter.featured = featured;
    }

    return Skill.find(filter).sort({ order: 1, name: 1 }).exec();
  }

  /**
   * Find skill by ID.
   * @param {string} id
   * @returns {Promise<import('mongoose').Document|null>}
   */
  async findById(id) {
    return Skill.findOne({ _id: id, isDeleted: false }).exec();
  }

  /**
   * Find skill by name.
   * @param {string} name
   * @returns {Promise<import('mongoose').Document|null>}
   */
  async findByName(name) {
    return Skill.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      isDeleted: false,
    }).exec();
  }

  /**
   * Create a new skill.
   * @param {Object} skillData
   * @returns {Promise<import('mongoose').Document>}
   */
  async create(skillData) {
    const skill = new Skill(skillData);
    return skill.save();
  }

  /**
   * Update skill by ID.
   * @param {string} id
   * @param {Object} updateData
   * @returns {Promise<import('mongoose').Document|null>}
   */
  async updateById(id, updateData) {
    return Skill.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();
  }

  /**
   * Soft delete skill by ID.
   * @param {string} id
   * @param {string} userId
   * @returns {Promise<import('mongoose').Document|null>}
   */
  async softDeleteById(id, userId) {
    return Skill.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { isDeleted: true, updatedBy: userId } },
      { new: true }
    ).exec();
  }
}

export const skillRepository = new SkillRepository();
export default skillRepository;
