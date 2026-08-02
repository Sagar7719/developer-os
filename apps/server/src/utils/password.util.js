import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const SALT_ROUNDS = 10;

/**
 * Hashes a plaintext password using bcrypt.
 * @param {string} password
 * @returns {Promise<string>}
 */
export const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compares a plaintext password with a bcrypt hash.
 * @param {string} password
 * @param {string} hashedPassword
 * @returns {Promise<boolean>}
 */
export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Generates a SHA-256 hash of a string (used for securing refresh tokens before DB storage).
 * @param {string} token
 * @returns {string} SHA-256 hex digest
 */
export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export default {
  hashPassword,
  comparePassword,
  hashToken,
};
