import apiClient from './client.js';

export const fetchExperiences = async () => {
  const response = await apiClient.get('/experience');
  return response.data.data.experiences;
};

export const createExperienceApi = async (experienceData) => {
  const response = await apiClient.post('/experience', experienceData);
  return response.data.data.experience;
};

export const updateExperienceApi = async ({ id, data }) => {
  const response = await apiClient.put(`/experience/${id}`, data);
  return response.data.data.experience;
};

export const deleteExperienceApi = async (id) => {
  const response = await apiClient.delete(`/experience/${id}`);
  return response.data;
};
