import { experienceRepository } from '../repositories/experience.repository.js';
import { ExperienceDTO } from '../dtos/experience.dto.js';
import { ApiError } from '../utils/apiError.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { ResponseMessages } from '../constants/responseMessages.js';
import { logger } from '../config/logger.js';

/**
 * ExperienceService — Layer 3: Business domain logic for Experience entities.
 */
export class ExperienceService {
  /**
   * Get all career experience timeline records.
   * @returns {Promise<ExperienceDTO[]>}
   */
  async getExperiences() {
    const experiences = await experienceRepository.findAll();
    return ExperienceDTO.from(experiences);
  }

  /**
   * Get single experience record by ID.
   * @param {string} id
   * @returns {Promise<ExperienceDTO>}
   */
  async getExperienceById(id) {
    const experience = await experienceRepository.findById(id);
    if (!experience) {
      throw new ApiError(HttpStatus.NOT_FOUND, ResponseMessages.NOT_FOUND);
    }
    return ExperienceDTO.from(experience);
  }

  /**
   * Create a new experience record.
   * @param {Object} experienceData
   * @param {string} userId
   * @returns {Promise<ExperienceDTO>}
   */
  async createExperience(experienceData, userId) {
    const newExperience = await experienceRepository.create({
      ...experienceData,
      createdBy: userId,
      updatedBy: userId,
    });

    logger.info('[Audit] Experience record created successfully', { experienceId: newExperience._id.toString(), userId });
    return ExperienceDTO.from(newExperience);
  }

  /**
   * Update an existing experience record.
   * @param {string} id
   * @param {Object} updateData
   * @param {string} userId
   * @returns {Promise<ExperienceDTO>}
   */
  async updateExperience(id, updateData, userId) {
    const existing = await experienceRepository.findById(id);
    if (!existing) {
      throw new ApiError(HttpStatus.NOT_FOUND, ResponseMessages.NOT_FOUND);
    }

    const updated = await experienceRepository.updateById(id, {
      ...updateData,
      updatedBy: userId,
    });

    logger.info('[Audit] Experience record updated successfully', { experienceId: id, userId });
    return ExperienceDTO.from(updated);
  }

  /**
   * Soft delete an experience record.
   * @param {string} id
   * @param {string} userId
   * @returns {Promise<void>}
   */
  async deleteExperience(id, userId) {
    const existing = await experienceRepository.findById(id);
    if (!existing) {
      throw new ApiError(HttpStatus.NOT_FOUND, ResponseMessages.NOT_FOUND);
    }

    await experienceRepository.softDeleteById(id, userId);
    logger.info('[Audit] Experience record soft-deleted successfully', { experienceId: id, userId });
  }
}

export const experienceService = new ExperienceService();
export default experienceService;
