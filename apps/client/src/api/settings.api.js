import apiClient from './client.js';

export const fetchPublicSettings = async () => {
  const response = await apiClient.get('/settings');
  return response.data.data;
};

export const fetchAdminSettings = async () => {
  const response = await apiClient.get('/settings/admin');
  return response.data.data;
};

export const updateSettings = async (settingsData) => {
  const response = await apiClient.put('/settings', settingsData);
  return response.data.data;
};
