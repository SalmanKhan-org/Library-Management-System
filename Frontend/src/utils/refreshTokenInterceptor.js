import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`, // or your server URL
  withCredentials: true,                // 🔐 Send cookies (access & refresh)
});


api.interceptors.response.use(
  response => response,                // if success, return as is
  async error => {
    const originalRequest = error.config;

    // If token expired (401) and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;   // mark request as retried to avoid infinite loop

      try {
        await api.get('/refresh-token');     // use refresh token from cookie to get new access token

        return api(originalRequest);         // retry the original request
      } catch (err) {
        return Promise.reject(err);          // if refresh also fails, reject
      }
    }

    return Promise.reject(error);            // for other errors
  }
);

export default api;
