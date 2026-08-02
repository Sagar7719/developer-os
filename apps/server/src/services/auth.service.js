import { userRepository } from '../repositories/user.repository.js';
import { hashPassword, comparePassword, hashToken } from '../utils/password.util.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.util.js';
import { UserDTO } from '../dtos/user.dto.js';
import { ApiError } from '../utils/apiError.js';
import { HttpStatus } from '../constants/httpStatus.js';
import { ResponseMessages } from '../constants/responseMessages.js';
import { Roles } from '../constants/roles.js';
import { logger } from '../config/logger.js';

/**
 * AuthService — Layer 3: Business domain logic for authentication and authorization.
 */
export class AuthService {
  /**
   * Registers a new user account.
   * @param {Object} registerDto - { name, email, password, role }
   * @returns {Promise<{ user: UserDTO, accessToken: string, refreshToken: string }>}
   */
  async register({ name, email, password, role = Roles.USER }) {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await userRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new ApiError(HttpStatus.CONFLICT, ResponseMessages.EMAIL_ALREADY_EXISTS);
    }

    const hashedPassword = await hashPassword(password);

    const user = await userRepository.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: Object.values(Roles).includes(role) ? role : Roles.USER,
    });

    const payload = { userId: user._id.toString(), email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken({ userId: user._id.toString() });

    const refreshTokenHash = hashToken(refreshToken);
    await userRepository.addRefreshTokenHash(user._id, refreshTokenHash);

    logger.info('[Audit] New user registered successfully', { userId: user._id.toString() });

    return {
      user: UserDTO.from(user),
      accessToken,
      refreshToken,
    };
  }

  /**
   * Authenticates user credentials and issues access & refresh token pair.
   * @param {Object} credentials - { email, password }
   * @returns {Promise<{ user: UserDTO, accessToken: string, refreshToken: string }>}
   */
  async login({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await userRepository.findByEmail(normalizedEmail, true);
    if (!user || !user.isActive) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, ResponseMessages.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, ResponseMessages.INVALID_CREDENTIALS);
    }

    const payload = { userId: user._id.toString(), email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken({ userId: user._id.toString() });

    const refreshTokenHash = hashToken(refreshToken);
    await userRepository.addRefreshTokenHash(user._id, refreshTokenHash);

    logger.info('[Audit] User logged in successfully', { userId: user._id.toString() });

    return {
      user: UserDTO.from(user),
      accessToken,
      refreshToken,
    };
  }

  /**
   * Logs out user by revoking the stored SHA-256 refresh token hash.
   * @param {string} userId
   * @param {string} [refreshToken]
   * @returns {Promise<void>}
   */
  async logout(userId, refreshToken) {
    if (refreshToken) {
      const refreshTokenHash = hashToken(refreshToken);
      await userRepository.removeRefreshTokenHash(userId, refreshTokenHash);
    } else if (userId) {
      await userRepository.clearAllRefreshTokenHashes(userId);
    }

    logger.info('[Audit] User logged out', { userId });
  }

  /**
   * Verifies an existing refresh token, rotates the refresh token, and issues a new token pair.
   * @param {string} refreshToken
   * @returns {Promise<{ user: UserDTO, accessToken: string, refreshToken: string }>}
   */
  async refreshTokens(refreshToken) {
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      throw new ApiError(HttpStatus.UNAUTHORIZED, ResponseMessages.INVALID_TOKEN);
    }

    const oldTokenHash = hashToken(refreshToken);
    const hasHash = await userRepository.hasRefreshTokenHash(decoded.userId, oldTokenHash);

    if (!hasHash) {
      // Possible reuse attack detected — invalidate all session tokens for this user
      await userRepository.clearAllRefreshTokenHashes(decoded.userId);
      logger.warn('[Security] Refresh token reuse detected. Revoked all sessions.', { userId: decoded.userId });
      throw new ApiError(HttpStatus.UNAUTHORIZED, ResponseMessages.INVALID_TOKEN);
    }

    const user = await userRepository.findById(decoded.userId);
    if (!user || !user.isActive) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, ResponseMessages.UNAUTHORIZED);
    }

    // Generate rotated token pair
    const payload = { userId: user._id.toString(), email: user.email, role: user.role };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken({ userId: user._id.toString() });

    const newTokenHash = hashToken(newRefreshToken);

    // Atomically swap old refresh token hash for new refresh token hash
    await userRepository.removeRefreshTokenHash(user._id, oldTokenHash);
    await userRepository.addRefreshTokenHash(user._id, newTokenHash);

    logger.info('[Audit] Refresh token rotated successfully', { userId: user._id.toString() });

    return {
      user: UserDTO.from(user),
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Retrieves profile information for the authenticated user.
   * @param {string} userId
   * @returns {Promise<UserDTO>}
   */
  async getCurrentUser(userId) {
    const user = await userRepository.findById(userId);
    if (!user || !user.isActive) {
      throw new ApiError(HttpStatus.NOT_FOUND, ResponseMessages.NOT_FOUND);
    }
    return UserDTO.from(user);
  }
}

export const authService = new AuthService();
export default authService;
