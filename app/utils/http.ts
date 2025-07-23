import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import xior from 'xior';
import dedupePlugin from 'xior/plugins/dedupe';
import errorCachePlugin from 'xior/plugins/error-cache';
import throttlePlugin from 'xior/plugins/throttle';

export const http = xior.create({ baseURL: import.meta.env.VITE_HOST });

// Add request interceptor to dynamically set Authorization header
http.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Add interceptor to handle errors and show toast notifications for client errors only
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    // Only show toast for client errors (status < 500)
    if (status && status < 500) {
      const message = error.response?.data?.message || 'There was a problem with the request';
      toast.error(message);
    }
    return Promise.reject(error);
  },
);

http.plugins.use(errorCachePlugin());
http.plugins.use(dedupePlugin());
http.plugins.use(throttlePlugin());
