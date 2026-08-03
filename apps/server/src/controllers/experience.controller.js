import { experienceService } from '../services/experience.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { ResponseMessages } from '../constants/responseMessages.js';

/**
 * ExperienceController — Layer 2: Parses HTTP requests and serializes experience response envelopes.
 */
export class ExperienceController {
  /**
   * GET /api/v1/experience
   */
  getExperiences = asyncHandler(async (req, res) => {
    const experiences = await experienceService.getExperiences();

    return res.status(HttpStatus.OK).json(
      ApiResponse.success({
        statusCode: HttpStatus.OK,
        message: ResponseMessages.SUCCESS,
        data: { experiences },
      })
    );
  });

  /**
   * POST /api/v1/experience
   */
  createExperience = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const experience = await experienceService.createExperience(req.body, userId);

    return res.status(HttpStatus.CREATED).json(
      ApiResponse.success({
        statusCode: HttpStatus.CREATED,
        message: ResponseMessages.CREATED_SUCCESS,
        data: { experience },
      })
    );
  });

  /**
   * PUT /api/v1/experience/:id
   */
  updateExperience = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const experience = await experienceService.updateExperience(id, req.body, userId);

    return res.status(HttpStatus.OK).json(
      ApiResponse.success({
        statusCode: HttpStatus.OK,
        message: ResponseMessages.UPDATED_SUCCESS,
        data: { experience },
      })
    );
  });

  /**
   * DELETE /api/v1/experience/:id
   */
  deleteExperience = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    await experienceService.deleteExperience(id, userId);

    return res.status(HttpStatus.OK).json(
      ApiResponse.success({
        statusCode: HttpStatus.OK,
        message: ResponseMessages.DELETED_SUCCESS,
      })
    );
  });
}

export const experienceController = new ExperienceController();
export default experienceController;
