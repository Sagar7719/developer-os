import { User } from '../models/user.model.js';

/**
 * UserRepository — Layer 4: Data Access abstraction for User entity.
 */
export class UserRepository {
  /**
   * Find user by email. Automatically normalizes email input.
   * @param {string} email
   * @param {boolean} [includePassword=false]
   * @returns {Promise<import('mongoose').Document|null>}
   */
  async findByEmail(email, includePassword = false) {
    const normalizedEmail = email ? email.trim().toLowerCase() : '';
    const query = User.findOne({ email: normalizedEmail });
    if (includePassword) {
      query.select('+password');
    }
    return query.exec();
  }

  /**
   * Find user by ID.
   * @param {string} id
   * @returns {Promise<import('mongoose').Document|null>}
   */
  async findById(id) {
    return User.findById(id).exec();
  }

  /**
   * Create a new user record.
   * @param {Object} userData
   * @returns {Promise<import('mongoose').Document>}
   */
  async create(userData) {
    const user = new User({
      ...userData,
      email: userData.email ? userData.email.trim().toLowerCase() : userData.email,
    });
    return user.save();
  }

  /**
   * Add a SHA-256 refresh token hash to user's refreshTokens array.
   * @param {string} userId
   * @param {string} tokenHash
   * @returns {Promise<void>}
   */
  async addRefreshTokenHash(userId, tokenHash) {
    await User.findByIdAndUpdate(userId, {
      $push: { refreshTokens: tokenHash },
    }).exec();
  }

  /**
   * Remove a specific SHA-256 refresh token hash from user's refreshTokens array.
   * @param {string} userId
   * @param {string} tokenHash
   * @returns {Promise<void>}
   */
  async removeRefreshTokenHash(userId, tokenHash) {
    await User.findByIdAndUpdate(userId, {
      $pull: { refreshTokens: tokenHash },
    }).exec();
  }

  /**
   * Clear all stored refresh token hashes for a user (e.g. forced security logout).
   * @param {string} userId
   * @returns {Promise<void>}
   */
  async clearAllRefreshTokenHashes(userId) {
    await User.findByIdAndUpdate(userId, {
      $set: { refreshTokens: [] },
    }).exec();
  }

  /**
   * Check if a user document contains a specific SHA-256 refresh token hash.
   * @param {string} userId
   * @param {string} tokenHash
   * @returns {Promise<boolean>}
   */
  async hasRefreshTokenHash(userId, tokenHash) {
    const user = await User.findOne({ _id: userId, refreshTokens: tokenHash }).exec();
    return Boolean(user);
  }
}

export const userRepository = new UserRepository();
export default userRepository;
