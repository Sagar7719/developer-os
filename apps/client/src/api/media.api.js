import apiClient from './client.js';

/**
 * Uploads file to server media endpoint.
 * @param {Object} options
 * @param {File} options.file - File object from input
 * @param {string} [options.folder] - Target folder name
 * @param {Function} [options.onUploadProgress] - Axios upload progress callback
 * @returns {Promise<Object>} Uploaded media DTO payload
 */
export const uploadMediaApi = async ({ file, folder = 'general', onUploadProgress } = {}) => {
  const formData = new FormData();
  if (file) formData.append('file', file);
  if (folder) formData.append('folder', folder);

  const response = await apiClient.post('/media/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onUploadProgress(percentCompleted);
      }
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
  const queryParams = {};
  if (params.folder && params.folder !== 'all') {
    queryParams.folder = params.folder;
  }
  if (params.page) queryParams.page = params.page;
  if (params.limit) queryParams.limit = params.limit;

  const response = await apiClient.get('/media', { params: queryParams });
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
