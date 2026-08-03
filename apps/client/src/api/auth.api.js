import apiClient, { setAccessToken } from './client.js';

/**
 * Authenticate user with credentials.
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} { user, accessToken }
 */
export const loginApi = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  const { user, accessToken } = response.data.data;
  setAccessToken(accessToken);
  return { user, accessToken };
};

/**
 * Log out active user and clear session tokens.
 * @returns {Promise<void>}
 */
export const logoutApi = async () => {
  try {
    await apiClient.post('/auth/logout');
  } finally {
    setAccessToken(null);
  }
};

/**
 * Fetch profile of currently authenticated user.
 * @returns {Promise<Object>} UserDTO object
 */
export const fetchMeApi = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data.data.user;
};
