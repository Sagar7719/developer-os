import axios from 'axios';

let accessTokenMemory =
  typeof window !== 'undefined' && typeof localStorage !== 'undefined'
    ? localStorage.getItem('developer_os_token')
    : null;

export const setAccessToken = (token) => {
  accessTokenMemory = token;
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    if (token) {
      localStorage.setItem('developer_os_token', token);
    } else {
      localStorage.removeItem('developer_os_token');
    }
  }
};

export const getAccessToken = () => accessTokenMemory;

export const apiClient = axios.create({
  baseURL: import.meta.env?.VITE_API_BASE_URL || '/api/v1',
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

let isRefreshing = false;
let failedQueue = [];

const processQueue = (err, token = null) => {
  failedQueue.forEach((prom) => {
    if (err) {
      prom.reject(err);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Enhance error object message while preserving original Axios error.response properties
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }

    const isAuthEndpoint =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/refresh-token') ||
      originalRequest?.url?.includes('/auth/register');

    // Handle 401 Unauthorized token refresh flow
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        const refreshUrl = (import.meta.env?.VITE_API_BASE_URL || '/api/v1') + '/auth/refresh-token';

        axios
          .post(refreshUrl, {}, { withCredentials: true })
          .then(({ data }) => {
            const newAccessToken = data?.data?.accessToken;
            if (!newAccessToken) {
              throw new Error('Refresh response missing access token.');
            }
            setAccessToken(newAccessToken);
            apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            processQueue(null, newAccessToken);
            resolve(apiClient(originalRequest));
          })
          .catch((refreshError) => {
            if (refreshError.response?.data?.message) {
              refreshError.message = refreshError.response.data.message;
            }
            processQueue(refreshError, null);
            setAccessToken(null);

            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('auth:unauthorized'));
            }

            reject(refreshError);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
