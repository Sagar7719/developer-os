import jwt from 'jsonwebtoken';
import { config } from '../config/env.config.js';

/**
 * Generates a short-lived Access Token.
 * Reads expiration strictly from config.jwtAccessExpiresIn environment setting.
 * @param {Object} payload - Token payload (userId, email, role)
 * @returns {string} Signed Access JWT string
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, config.jwtAccessSecret, {
    expiresIn: config.jwtAccessExpiresIn,
  });
};

/**
 * Generates a long-lived Refresh Token.
 * Reads expiration strictly from config.jwtRefreshExpiresIn environment setting.
 * @param {Object} payload - Token payload (userId)
 * @returns {string} Signed Refresh JWT string
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn,
  });
};

/**
 * Verifies an Access Token.
 * @param {string} token
 * @returns {Object} Decoded payload
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, config.jwtAccessSecret);
};

/**
 * Verifies a Refresh Token.
 * @param {string} token
 * @returns {Object} Decoded payload
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.jwtRefreshSecret);
};

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
