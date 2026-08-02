import { authService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { ResponseMessages } from '../constants/responseMessages.js';
import {
  REFRESH_COOKIE_NAME,
  getRefreshCookieOptions,
  getClearCookieOptions,
} from '../config/cookie.config.js';

/**
 * Auth Controller — Layer 2: Parses HTTP request, serializes response envelopes, manages cookies.
 */
export class AuthController {
  /**
   * POST /api/v1/auth/register
   */
  register = asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.register(req.body);

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, getRefreshCookieOptions());

    return res.status(HttpStatus.CREATED).json(
      ApiResponse.success({
        statusCode: HttpStatus.CREATED,
        message: ResponseMessages.REGISTER_SUCCESS,
        data: { user, accessToken },
      })
    );
  });

  /**
   * POST /api/v1/auth/login
   */
  login = asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.login(req.body);

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, getRefreshCookieOptions());

    return res.status(HttpStatus.OK).json(
      ApiResponse.success({
        statusCode: HttpStatus.OK,
        message: ResponseMessages.LOGIN_SUCCESS,
        data: { user, accessToken },
      })
    );
  });

  /**
   * POST /api/v1/auth/logout
   */
  logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME] || req.body?.refreshToken;
    const userId = req.user?.userId;

    await authService.logout(userId, refreshToken);

    res.clearCookie(REFRESH_COOKIE_NAME, getClearCookieOptions());

    return res.status(HttpStatus.OK).json(
      ApiResponse.success({
        statusCode: HttpStatus.OK,
        message: ResponseMessages.LOGOUT_SUCCESS,
      })
    );
  });

  /**
   * POST /api/v1/auth/refresh-token
   */
  refreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME] || req.body?.refreshToken;
    if (!refreshToken) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Refresh token is required.');
    }

    const { user, accessToken, refreshToken: newRefreshToken } =
      await authService.refreshTokens(refreshToken);

    res.cookie(REFRESH_COOKIE_NAME, newRefreshToken, getRefreshCookieOptions());

    return res.status(HttpStatus.OK).json(
      ApiResponse.success({
        statusCode: HttpStatus.OK,
        message: ResponseMessages.TOKEN_REFRESHED,
        data: { user, accessToken },
      })
    );
  });

  /**
   * GET /api/v1/auth/me
   */
  getMe = asyncHandler(async (req, res) => {
    const user = await authService.getCurrentUser(req.user.userId);

    return res.status(HttpStatus.OK).json(
      ApiResponse.success({
        statusCode: HttpStatus.OK,
        data: { user },
      })
    );
  });
}

export const authController = new AuthController();
export default authController;
