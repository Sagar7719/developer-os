import apiClient from './client.js';

export const fetchDashboardStats = async () => {
  const response = await apiClient.get('/dashboard/stats');
  return response.data.data.stats;
};
