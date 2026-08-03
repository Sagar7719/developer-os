import axios from 'axios';

let accessTokenMemory = localStorage.getItem('developer_os_token') || null;

export const setAccessToken = (token) => {
  accessTokenMemory = token;
  if (token) {
    localStorage.setItem('developer_os_token', token);
  } else {
    localStorage.removeItem('developer_os_token');
  }
};

export const getAccessToken = () => accessTokenMemory;

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    if (accessTokenMemory) {
      config.headers.Authorization = `Bearer ${accessTokenMemory}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
