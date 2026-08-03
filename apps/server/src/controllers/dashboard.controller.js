import { dashboardService } from '../services/dashboard.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { ResponseMessages } from '../constants/responseMessages.js';

/**
 * DashboardController — Layer 2: Parses HTTP requests and serializes dashboard statistics responses.
 */
export class DashboardController {
  /**
   * GET /api/v1/dashboard/stats
   */
  getStats = asyncHandler(async (req, res) => {
    const stats = await dashboardService.getDashboardStats();

    return res.status(HttpStatus.OK).json(
      ApiResponse.success({
        statusCode: HttpStatus.OK,
        message: ResponseMessages.SUCCESS,
        data: { stats },
      })
    );
  });
}

export const dashboardController = new DashboardController();
export default dashboardController;
