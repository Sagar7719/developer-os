import { config } from './env.config.js';

/**
 * Centralized Cookie Configuration for Refresh Tokens.
 */
export const REFRESH_COOKIE_NAME = 'refreshToken';

/**
 * Returns options for setting the refresh token httpOnly cookie.
 * @returns {import('express').CookieOptions}
 */
export const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: config.isProduction,
  sameSite: config.isProduction ? 'strict' : 'lax',
  path: '/api/v1/auth',
  // 7 days in milliseconds (7 * 24 * 60 * 60 * 1000)
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

/**
 * Returns options for clearing the refresh token httpOnly cookie.
 * @returns {import('express').CookieOptions}
 */
export const getClearCookieOptions = () => ({
  httpOnly: true,
  secure: config.isProduction,
  sameSite: config.isProduction ? 'strict' : 'lax',
  path: '/api/v1/auth',
});

export default {
  REFRESH_COOKIE_NAME,
  getRefreshCookieOptions,
  getClearCookieOptions,
};
