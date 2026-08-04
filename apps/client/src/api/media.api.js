import apiClient from './client.js';

/**
 * Uploads file to server media endpoint.
 * @param {File} file - File object from input
 * @param {string} [folder] - Target folder name
 * @returns {Promise<Object>} Uploaded media DTO payload
 */
export const uploadMediaApi = async (file, folder = 'general') => {
  const formData = new FormData();
  formData.append('file', file);
  if (folder) {
    formData.append('folder', folder);
  }

  const response = await apiClient.post('/media/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data.media;
};

/**
 * Fetches paginated list of media assets.
 * @param {Object} params - { folder, page, limit }
 * @returns {Promise<{ items: Array, total: number, page: number, totalPages: number }>}
 */
export const fetchMediaApi = async (params = {}) => {
  const response = await apiClient.get('/media', { params });
  return response.data.data;
};

/**
 * Fetches single media asset by ID.
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const fetchMediaByIdApi = async (id) => {
  const response = await apiClient.get(`/media/${id}`);
  return response.data.data.media;
};

/**
 * Deletes media asset by ID.
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const deleteMediaApi = async (id) => {
  const response = await apiClient.delete(`/media/${id}`);
  return response.data.data;
};
