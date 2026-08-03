import { Experience } from '../models/experience.model.js';

/**
 * ExperienceRepository — Layer 4: Data Access abstraction for Experience entity.
 */
export class ExperienceRepository {
  /**
   * Find all non-deleted career experience entries sorted by order & start date.
   * @returns {Promise<import('mongoose').Document[]>}
   */
  async findAll() {
    return Experience.find({ isDeleted: false })
      .sort({ order: 1, startDate: -1 })
      .exec();
  }

  /**
   * Find experience entry by ID.
   * @param {string} id
   * @returns {Promise<import('mongoose').Document|null>}
   */
  async findById(id) {
    return Experience.findOne({ _id: id, isDeleted: false }).exec();
  }

  /**
   * Create a new experience record.
   * @param {Object} experienceData
   * @returns {Promise<import('mongoose').Document>}
   */
  async create(experienceData) {
    const experience = new Experience(experienceData);
    return experience.save();
  }

  /**
   * Update experience record by ID.
   * @param {string} id
   * @param {Object} updateData
   * @returns {Promise<import('mongoose').Document|null>}
   */
  async updateById(id, updateData) {
    return Experience.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();
  }

  /**
   * Soft delete experience record by ID.
   * @param {string} id
   * @param {string} userId
   * @returns {Promise<import('mongoose').Document|null>}
   */
  async softDeleteById(id, userId) {
    return Experience.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { isDeleted: true, updatedBy: userId } },
      { new: true }
    ).exec();
  }
}

export const experienceRepository = new ExperienceRepository();
export default experienceRepository;
