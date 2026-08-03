import { projectRepository } from '../repositories/project.repository.js';
import { ProjectDTO } from '../dtos/project.dto.js';
import { slugify } from '../utils/slug.util.js';
import { ApiError } from '../utils/apiError.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { ResponseMessages } from '../constants/responseMessages.js';
import { logger } from '../config/logger.js';

/**
 * ProjectService — Layer 3: Business domain logic for Project entities.
 */
export class ProjectService {
  /**
   * Get list of projects matching filter options.
   * @param {Object} queryOptions - { category, featured, isPublished, limit }
   * @returns {Promise<ProjectDTO[]>}
   */
  async getProjects(queryOptions = {}) {
    const projects = await projectRepository.findAll(queryOptions);
    return ProjectDTO.from(projects);
  }

  /**
   * Get single project by unique slug.
   * @param {string} slug
   * @returns {Promise<ProjectDTO>}
   */
  async getProjectBySlug(slug) {
    const project = await projectRepository.findBySlug(slug);
    if (!project) {
      throw new ApiError(HttpStatus.NOT_FOUND, ResponseMessages.NOT_FOUND);
    }
    return ProjectDTO.from(project);
  }

  /**
   * Get single project by ID.
   * @param {string} id
   * @returns {Promise<ProjectDTO>}
   */
  async getProjectById(id) {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new ApiError(HttpStatus.NOT_FOUND, ResponseMessages.NOT_FOUND);
    }
    return ProjectDTO.from(project);
  }

  /**
   * Create a new project. Auto-generates unique slug if not provided.
   * @param {Object} projectData
   * @param {string} userId
   * @returns {Promise<ProjectDTO>}
   */
  async createProject(projectData, userId) {
    const generatedSlug = projectData.slug ? slugify(projectData.slug) : slugify(projectData.title);

    const existing = await projectRepository.findBySlug(generatedSlug);
    if (existing) {
      throw new ApiError(HttpStatus.CONFLICT, 'A project with this title/slug already exists.');
    }

    const newProject = await projectRepository.create({
      ...projectData,
      slug: generatedSlug,
      createdBy: userId,
      updatedBy: userId,
    });

    logger.info('[Audit] Project created successfully', { projectId: newProject._id.toString(), userId });
    return ProjectDTO.from(newProject);
  }

  /**
   * Update an existing project.
   * @param {string} id
   * @param {Object} updateData
   * @param {string} userId
   * @returns {Promise<ProjectDTO>}
   */
  async updateProject(id, updateData, userId) {
    const existing = await projectRepository.findById(id);
    if (!existing) {
      throw new ApiError(HttpStatus.NOT_FOUND, ResponseMessages.NOT_FOUND);
    }

    if (updateData.title || updateData.slug) {
      const targetSlug = updateData.slug ? slugify(updateData.slug) : slugify(updateData.title);
      if (targetSlug !== existing.slug) {
        const slugCheck = await projectRepository.findBySlug(targetSlug);
        if (slugCheck) {
          throw new ApiError(HttpStatus.CONFLICT, 'A project with this title/slug already exists.');
        }
        updateData.slug = targetSlug;
      }
    }

    const updated = await projectRepository.updateById(id, {
      ...updateData,
      updatedBy: userId,
    });

    logger.info('[Audit] Project updated successfully', { projectId: id, userId });
    return ProjectDTO.from(updated);
  }

  /**
   * Soft delete a project.
   * @param {string} id
   * @param {string} userId
   * @returns {Promise<void>}
   */
  async deleteProject(id, userId) {
    const existing = await projectRepository.findById(id);
    if (!existing) {
      throw new ApiError(HttpStatus.NOT_FOUND, ResponseMessages.NOT_FOUND);
    }

    await projectRepository.softDeleteById(id, userId);
    logger.info('[Audit] Project soft-deleted successfully', { projectId: id, userId });
  }
}

export const projectService = new ProjectService();
export default projectService;
