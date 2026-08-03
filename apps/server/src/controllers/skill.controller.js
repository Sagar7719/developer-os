import { skillService } from '../services/skill.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { ResponseMessages } from '../constants/responseMessages.js';

/**
 * SkillController — Layer 2: Parses HTTP requests and serializes skill response envelopes.
 */
export class SkillController {
  /**
   * GET /api/v1/skills
   */
  getSkills = asyncHandler(async (req, res) => {
    const { category, featured } = req.query;
    const skills = await skillService.getSkills({ category, featured });

    return res.status(HttpStatus.OK).json(
      ApiResponse.success({
        statusCode: HttpStatus.OK,
        message: ResponseMessages.SUCCESS,
        data: { skills },
      })
    );
  });

  /**
   * POST /api/v1/skills
   */
  createSkill = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const skill = await skillService.createSkill(req.body, userId);

    return res.status(HttpStatus.CREATED).json(
      ApiResponse.success({
        statusCode: HttpStatus.CREATED,
        message: ResponseMessages.CREATED_SUCCESS,
        data: { skill },
      })
    );
  });

  /**
   * PUT /api/v1/skills/:id
   */
  updateSkill = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const skill = await skillService.updateSkill(id, req.body, userId);

    return res.status(HttpStatus.OK).json(
      ApiResponse.success({
        statusCode: HttpStatus.OK,
        message: ResponseMessages.UPDATED_SUCCESS,
        data: { skill },
      })
    );
  });

  /**
   * DELETE /api/v1/skills/:id
   */
  deleteSkill = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    await skillService.deleteSkill(id, userId);

    return res.status(HttpStatus.OK).json(
      ApiResponse.success({
        statusCode: HttpStatus.OK,
        message: ResponseMessages.DELETED_SUCCESS,
      })
    );
  });
}

export const skillController = new SkillController();
export default skillController;
