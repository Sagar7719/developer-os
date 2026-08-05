import apiClient from './client.js';

export const fetchProjects = async (params = {}) => {
  const cleanParams = { ...params };
  if (cleanParams.status === 'all') delete cleanParams.status;
  if (!cleanParams.search || !cleanParams.search.trim()) delete cleanParams.search;
  const response = await apiClient.get('/projects', { params: cleanParams });
  return response.data.data.projects;
};

export const fetchAdminProjects = async (params = {}) => {
  const cleanParams = { ...params };
  if (cleanParams.status === 'all') delete cleanParams.status;
  if (!cleanParams.search || !cleanParams.search.trim()) delete cleanParams.search;
  const response = await apiClient.get('/projects/admin/all', { params: cleanParams });
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

export const updateProjectStatusApi = async ({ id, status }) => {
  const response = await apiClient.patch(`/projects/${id}/status`, { status });
  return response.data.data.project;
};

export const updateProjectFeaturedApi = async ({ id, isFeatured }) => {
  const response = await apiClient.patch(`/projects/${id}/featured`, { isFeatured, featured: isFeatured });
  return response.data.data.project;
};

export const reorderProjectsApi = async (items) => {
  const response = await apiClient.put('/projects/reorder', { items });
  return response.data;
};

export const deleteProjectApi = async (id) => {
  const response = await apiClient.delete(`/projects/${id}`);
  return response.data;
};

export const restoreProjectApi = async (id) => {
  const response = await apiClient.patch(`/projects/${id}/restore`);
  return response.data.data.project;
};

