import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor — unwrap data, handle token refresh
api.interceptors.response.use(
  (response) => response.data as any, // Needs assertion to bypass Axios internal typing
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't retried yet, try refreshing the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        return api(originalRequest);
      } catch {
        // Refresh also failed — force logout
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(error.response?.data);
      }
    }

    return Promise.reject(error.response?.data || { message: error.message });
  }
);

export { api };
