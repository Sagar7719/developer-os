import { skillRepository } from '../repositories/skill.repository.js';
import { SkillDTO } from '../dtos/skill.dto.js';
import { ApiError } from '../utils/apiError.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { ResponseMessages } from '../constants/responseMessages.js';
import { logger } from '../config/logger.js';

/**
 * SkillService — Layer 3: Business domain logic for Skill entities.
 */
export class SkillService {
  /**
   * Get list of skills.
   * @param {Object} queryOptions - { category, featured }
   * @returns {Promise<SkillDTO[]>}
   */
  async getSkills(queryOptions = {}) {
    const skills = await skillRepository.findAll(queryOptions);
    return SkillDTO.from(skills);
  }

  /**
   * Get single skill by ID.
   * @param {string} id
   * @returns {Promise<SkillDTO>}
   */
  async getSkillById(id) {
    const skill = await skillRepository.findById(id);
    if (!skill) {
      throw new ApiError(HttpStatus.NOT_FOUND, ResponseMessages.NOT_FOUND);
    }
    return SkillDTO.from(skill);
  }

  /**
   * Create a new skill entry.
   * @param {Object} skillData
   * @param {string} userId
   * @returns {Promise<SkillDTO>}
   */
  async createSkill(skillData, userId) {
    const existing = await skillRepository.findByName(skillData.name);
    if (existing) {
      throw new ApiError(HttpStatus.CONFLICT, 'A skill with this name already exists.');
    }

    const newSkill = await skillRepository.create({
      ...skillData,
      createdBy: userId,
      updatedBy: userId,
    });

    logger.info('[Audit] Skill created successfully', { skillId: newSkill._id.toString(), userId });
    return SkillDTO.from(newSkill);
  }

  /**
   * Update an existing skill entry.
   * @param {string} id
   * @param {Object} updateData
   * @param {string} userId
   * @returns {Promise<SkillDTO>}
   */
  async updateSkill(id, updateData, userId) {
    const existing = await skillRepository.findById(id);
    if (!existing) {
      throw new ApiError(HttpStatus.NOT_FOUND, ResponseMessages.NOT_FOUND);
    }

    if (updateData.name && updateData.name.trim().toLowerCase() !== existing.name.toLowerCase()) {
      const nameCheck = await skillRepository.findByName(updateData.name);
      if (nameCheck) {
        throw new ApiError(HttpStatus.CONFLICT, 'A skill with this name already exists.');
      }
    }

    const updated = await skillRepository.updateById(id, {
      ...updateData,
      updatedBy: userId,
    });

    logger.info('[Audit] Skill updated successfully', { skillId: id, userId });
    return SkillDTO.from(updated);
  }

  /**
   * Soft delete a skill entry.
   * @param {string} id
   * @param {string} userId
   * @returns {Promise<void>}
   */
  async deleteSkill(id, userId) {
    const existing = await skillRepository.findById(id);
    if (!existing) {
      throw new ApiError(HttpStatus.NOT_FOUND, ResponseMessages.NOT_FOUND);
    }

    await skillRepository.softDeleteById(id, userId);
    logger.info('[Audit] Skill soft-deleted successfully', { skillId: id, userId });
  }
}

export const skillService = new SkillService();
export default skillService;
