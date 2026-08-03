import { Project } from '../models/project.model.js';

/**
 * ProjectRepository — Layer 4: Data Access abstraction for Project entity.
 */
export class ProjectRepository {
  /**
   * Find all non-deleted projects with optional filtering options.
   * @param {Object} options
   * @param {string} [options.category]
   * @param {boolean} [options.featured]
   * @param {boolean} [options.isPublished=true]
   * @param {number} [options.limit]
   * @returns {Promise<import('mongoose').Document[]>}
   */
  async findAll({ category, featured, isPublished = true, limit } = {}) {
    const filter = { isDeleted: false };

    if (isPublished !== undefined && isPublished !== null) {
      filter.isPublished = isPublished;
    }
    if (category) {
      filter.category = category;
    }
    if (featured !== undefined && featured !== null) {
      filter.featured = featured;
    }

    const query = Project.find(filter).sort({ order: 1, createdAt: -1 });

    if (limit && typeof limit === 'number' && limit > 0) {
      query.limit(limit);
    }

    return query.exec();
  }

  /**
   * Find project by slug.
   * @param {string} slug
   * @returns {Promise<import('mongoose').Document|null>}
   */
  async findBySlug(slug) {
    return Project.findOne({ slug: slug.trim().toLowerCase(), isDeleted: false }).exec();
  }

  /**
   * Find project by ID.
   * @param {string} id
   * @returns {Promise<import('mongoose').Document|null>}
   */
  async findById(id) {
    return Project.findOne({ _id: id, isDeleted: false }).exec();
  }

  /**
   * Create a new project.
   * @param {Object} projectData
   * @returns {Promise<import('mongoose').Document>}
   */
  async create(projectData) {
    const project = new Project(projectData);
    return project.save();
  }

  /**
   * Update project by ID.
   * @param {string} id
   * @param {Object} updateData
   * @returns {Promise<import('mongoose').Document|null>}
   */
  async updateById(id, updateData) {
    return Project.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();
  }

  /**
   * Soft delete project by ID.
   * @param {string} id
   * @param {string} userId
   * @returns {Promise<import('mongoose').Document|null>}
   */
  async softDeleteById(id, userId) {
    return Project.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { isDeleted: true, updatedBy: userId } },
      { new: true }
    ).exec();
  }
}

export const projectRepository = new ProjectRepository();
export default projectRepository;
