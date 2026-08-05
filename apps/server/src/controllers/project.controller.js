import { projectService } from '../services/project.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { ResponseMessages } from '../constants/responseMessages.js';

/**
 * ProjectController — Layer 2: Parses HTTP requests and serializes project response envelopes.
 */
export class ProjectController {
  /**
   * GET /api/v1/projects (Public)
   */
  getProjects = asyncHandler(async (req, res) => {
    const { category, featured, isFeatured, isPublished, status, search, limit } = req.query;
    const projects = await projectService.getProjects({
      category,
      featured,
      isFeatured,
      isPublished: isPublished !== undefined ? isPublished : true,
      status: status || 'published',
      search,
      includeDeleted: false,
      limit,
    });

    return res.status(HttpStatus.OK).json(
      ApiResponse.success({
        statusCode: HttpStatus.OK,
        message: ResponseMessages.SUCCESS,
        data: { projects },
      })
    );
  });

  /**
   * GET /api/v1/projects/admin/all (Admin Protected)
   */
  getAdminProjects = asyncHandler(async (req, res) => {
    const { category, featured, isFeatured, status, search, limit } = req.query;
    const projects = await projectService.getProjects({
      category,
      featured,
      isFeatured,
      status,
      search,
      includeDeleted: true,
      limit,
    });

    return res.status(HttpStatus.OK).json(
      ApiResponse.success({
        statusCode: HttpStatus.OK,
        message: ResponseMessages.SUCCESS,
        data: { projects },
      })
    );
  });

  /**
   * GET /api/v1/projects/:slug
   */
  getProjectBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const project = await projectService.getProjectBySlug(slug);

    return res.status(HttpStatus.OK).json(
      ApiResponse.success({
        statusCode: HttpStatus.OK,
        message: ResponseMessages.SUCCESS,
        data: { project },
      })
    );
  });

  /**
   * POST /api/v1/projects
   */
  createProject = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const project = await projectService.createProject(req.body, userId);

    return res.status(HttpStatus.CREATED).json(
      ApiResponse.success({
        statusCode: HttpStatus.CREATED,
        message: ResponseMessages.CREATED_SUCCESS,
        data: { project },
      })
    );
  });

  /**
   * PUT /api/v1/projects/:id
   */
  updateProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const project = await projectService.updateProject(id, req.body, userId);

    return res.status(HttpStatus.OK).json(
      ApiResponse.success({
        statusCode: HttpStatus.OK,
        message: ResponseMessages.UPDATED_SUCCESS,
        data: { project },
      })
    );
  });

  /**
   * PATCH /api/v1/projects/:id/status
   */
  updateProjectStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.userId;

    const project = await projectService.updateProject(id, { status }, userId);

    return res.status(HttpStatus.OK).json(
      ApiResponse.success({
        statusCode: HttpStatus.OK,
        message: ResponseMessages.UPDATED_SUCCESS,
        data: { project },
      })
    );
  });

  /**
   * PATCH /api/v1/projects/:id/featured
   */
  updateProjectFeatured = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { isFeatured, featured } = req.body;
    const userId = req.user.userId;
    const targetFlag = isFeatured !== undefined ? isFeatured : featured;

    const project = await projectService.updateProject(id, { isFeatured: targetFlag, featured: targetFlag }, userId);

    return res.status(HttpStatus.OK).json(
      ApiResponse.success({
        statusCode: HttpStatus.OK,
        message: ResponseMessages.UPDATED_SUCCESS,
        data: { project },
      })
    );
  });

  /**
   * PUT /api/v1/projects/reorder
   */
  reorderProjects = asyncHandler(async (req, res) => {
    const { items } = req.body;
    const userId = req.user.userId;
    await projectService.reorderProjects(items, userId);

    return res.status(HttpStatus.OK).json(
      ApiResponse.success({
        statusCode: HttpStatus.OK,
        message: 'Projects reordered successfully',
      })
    );
  });

  /**
   * DELETE /api/v1/projects/:id (Soft Delete)
   */
  deleteProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    await projectService.deleteProject(id, userId);

    return res.status(HttpStatus.OK).json(
      ApiResponse.success({
        statusCode: HttpStatus.OK,
        message: ResponseMessages.DELETED_SUCCESS,
      })
    );
  });

  /**
   * PATCH /api/v1/projects/:id/restore (Admin Restore Soft Deleted)
   */
  restoreProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const project = await projectService.restoreProject(id, userId);

    return res.status(HttpStatus.OK).json(
      ApiResponse.success({
        statusCode: HttpStatus.OK,
        message: 'Project restored successfully',
        data: { project },
      })
    );
  });
}

export const projectController = new ProjectController();
export default projectController;

