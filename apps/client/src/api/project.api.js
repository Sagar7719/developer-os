import apiClient from './client.js';

export const fetchProjects = async (params = {}) => {
  const response = await apiClient.get('/projects', { params });
  return response.data.data.projects;
};

export const fetchProjectBySlug = async (slug) => {
  const response = await apiClient.get(`/projects/${slug}`);
  return response.data.data.project;
};

export const createProjectApi = async (projectData) => {
  const response = await apiClient.post('/projects', projectData);
  return response.data.data.project;
};

export const updateProjectApi = async ({ id, data }) => {
  const response = await apiClient.put(`/projects/${id}`, data);
  return response.data.data.project;
};

export const deleteProjectApi = async (id) => {
  const response = await apiClient.delete(`/projects/${id}`);
  return response.data;
};
