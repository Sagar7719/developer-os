import { healthService } from '../services/health.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { ResponseMessages } from '../constants/responseMessages.js';

/**
 * Health Controller — Layer 2: Parses HTTP request and serializes response envelope.
 */
export class HealthController {
  /**
   * GET /api/v1/health handler
   */
  getHealth = asyncHandler(async (req, res) => {
    const healthData = await healthService.getHealthStatus();

    return res.status(HttpStatus.OK).json(
      ApiResponse.success({
        statusCode: HttpStatus.OK,
        message: ResponseMessages.HEALTH_OK,
        data: healthData,
      })
    );
  });
}

export const healthController = new HealthController();
export default healthController;
