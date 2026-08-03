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
   * GET /api/v1/projects
   */
  getProjects = asyncHandler(async (req, res) => {
    const { category, featured, isPublished, limit } = req.query;
    const projects = await projectService.getProjects({ category, featured, isPublished, limit });

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
   * DELETE /api/v1/projects/:id
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
}

export const projectController = new ProjectController();
export default projectController;
