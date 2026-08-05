import { Project } from '../models/project.model.js';

/**
 * ProjectRepository — Layer 4: Data Access abstraction for Project entity.
 */
export class ProjectRepository {
  /**
   * Find projects with filtering, search, status, and featured priority sorting.
   * @param {Object} options
   * @param {string} [options.category]
   * @param {boolean} [options.featured]
   * @param {boolean} [options.isFeatured]
   * @param {boolean} [options.isPublished]
   * @param {string} [options.status]
   * @param {string} [options.search]
   * @param {boolean} [options.includeDeleted=false]
   * @param {number} [options.limit]
   * @returns {Promise<import('mongoose').Document[]>}
   */
  async findAll({
    category,
    featured,
    isFeatured,
    isPublished,
    status,
    search,
    includeDeleted = false,
    limit,
  } = {}) {
    const filter = {};

    if (includeDeleted) {
      if (status === 'deleted') {
        filter.isDeleted = true;
      }
    } else {
      filter.isDeleted = false;
    }

    if (status === 'published') {
      filter.$or = [{ status: 'published' }, { isPublished: true }];
    } else if (status === 'draft') {
      filter.$or = [{ status: 'draft' }, { isPublished: false, status: { $ne: 'archived' } }];
    } else if (status && status !== 'deleted' && status !== 'all') {
      filter.status = status;
    } else if (isPublished !== undefined && isPublished !== null) {
      filter.isPublished = isPublished;
    }


    if (category) {
      filter.category = category;
    }

    const featuredFlag = isFeatured !== undefined ? isFeatured : featured;
    if (featuredFlag !== undefined && featuredFlag !== null) {
      filter.$or = [{ isFeatured: featuredFlag }, { featured: featuredFlag }];
    }

    if (search && search.trim()) {
      filter.$text = { $search: search.trim() };
    }

    const query = Project.find(filter)
      .populate('coverImageMediaId')
      .populate('gallery.mediaId')
      .sort({ isFeatured: -1, order: 1, createdAt: -1 });

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
    return Project.findOne({ slug: slug.trim().toLowerCase(), isDeleted: false })
      .populate('coverImageMediaId')
      .populate('gallery.mediaId')
      .exec();
  }

  /**
   * Find project by ID.
   * @param {string} id
   * @param {boolean} [includeDeleted=false]
   * @returns {Promise<import('mongoose').Document|null>}
   */
  async findById(id, includeDeleted = false) {
    const filter = { _id: id };
    if (!includeDeleted) {
      filter.isDeleted = false;
    }
    return Project.findOne(filter)
      .populate('coverImageMediaId')
      .populate('gallery.mediaId')
      .exec();
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
    )
      .populate('coverImageMediaId')
      .populate('gallery.mediaId')
      .exec();
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
      { $set: { isDeleted: true, deletedAt: new Date(), updatedBy: userId } },
      { new: true }
    ).exec();
  }

  /**
   * Restore soft-deleted project by ID.
   * @param {string} id
   * @param {string} userId
   * @returns {Promise<import('mongoose').Document|null>}
   */
  async restoreById(id, userId) {
    return Project.findOneAndUpdate(
      { _id: id, isDeleted: true },
      { $set: { isDeleted: false, deletedAt: null, updatedBy: userId } },
      { new: true }
    )
      .populate('coverImageMediaId')
      .populate('gallery.mediaId')
      .exec();
  }

  /**
   * Bulk reorder projects.
   * @param {Array<{id: string, order: number}>} items
   * @returns {Promise<void>}
   */
  async reorderProjects(items) {
    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { order: item.order } },
      },
    }));
    await Project.bulkWrite(bulkOps);
  }
}

export const projectRepository = new ProjectRepository();
export default projectRepository;

