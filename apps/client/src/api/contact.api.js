import apiClient from './client.js';

export const submitContactForm = async (contactData) => {
  const response = await apiClient.post('/contact', contactData);
  return response.data.data.contact;
};

export const fetchContactMessages = async (params = {}) => {
  const response = await apiClient.get('/contact', { params });
  return response.data.data.contacts;
};

export const fetchContactById = async (id) => {
  const response = await apiClient.get(`/contact/${id}`);
  return response.data.data.contact;
};

export const updateContactStatus = async ({ id, status }) => {
  const response = await apiClient.patch(`/contact/${id}/status`, { status });
  return response.data.data.contact;
};

export const deleteContact = async (id) => {
  const response = await apiClient.delete(`/contact/${id}`);
  return response.data;
};
