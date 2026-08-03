import apiClient from './client.js';

export const fetchSkills = async (params = {}) => {
  const response = await apiClient.get('/skills', { params });
  return response.data.data.skills;
};

export const createSkillApi = async (skillData) => {
  const response = await apiClient.post('/skills', skillData);
  return response.data.data.skill;
};

export const updateSkillApi = async ({ id, data }) => {
  const response = await apiClient.put(`/skills/${id}`, data);
  return response.data.data.skill;
};

export const deleteSkillApi = async (id) => {
  const response = await apiClient.delete(`/skills/${id}`);
  return response.data;
};
