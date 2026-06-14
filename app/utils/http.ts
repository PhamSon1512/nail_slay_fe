import toast from 'react-hot-toast';
import xior from 'xior';
import dedupePlugin from 'xior/plugins/dedupe';
import errorCachePlugin from 'xior/plugins/error-cache';
import throttlePlugin from 'xior/plugins/throttle';
import { readStoredToken } from './tokenStorage';

export function getApiErrorMessage(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined;
  const record = data as Record<string, unknown>;
  if (typeof record.message === 'string') return record.message;
  const nested = record.error;
  if (nested && typeof nested === 'object' && typeof (nested as { message?: unknown }).message === 'string') {
    return (nested as { message: string }).message;
  }
  return undefined;
}

export const http = xior.create({
  baseURL: import.meta.env.VITE_HOST,
  withCredentials: true,
});

// Add request interceptor to dynamically set Authorization header
http.interceptors.request.use(
  (config) => {
    const token = readStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Let browser set multipart boundary for FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
      delete config.headers['content-type'];
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
    const url = error.config?.url;

    // Không hiển thị popup lỗi nếu là gọi API /profile bị từ chối do token hết hạn/lỗi
    if (url === '/profile' && (status === 400 || status === 401 || status === 403)) {
      return Promise.reject(error);
    }

    // Only show toast for client errors (status < 500)
    if (status && status < 500) {
      let message = getApiErrorMessage(error.response?.data) || 'Đã xảy ra lỗi, vui lòng thử lại sau.';
      
      // Dịch nhanh các lỗi tiếng Anh phổ biến do backend hoặc network trả về
      if (typeof message === 'string') {
        const lowerMsg = message.toLowerCase();
        if (lowerMsg.includes('unauthorized')) message = 'Vui lòng đăng nhập để tiếp tục.';
        else if (lowerMsg.includes('forbidden')) message = 'Bạn không có quyền thực hiện thao tác này.';
        else if (lowerMsg.includes('problem with the request')) message = 'Yêu cầu không hợp lệ, vui lòng thử lại.';
        else if (lowerMsg.includes('not found')) message = 'Không tìm thấy dữ liệu.';
        else if (lowerMsg.includes('validation error') || lowerMsg.includes('bad request')) message = 'Dữ liệu không hợp lệ.';
      }

      toast.error(message);
    }
    return Promise.reject(error);
  },
);

http.plugins.use(errorCachePlugin());
http.plugins.use(dedupePlugin());
http.plugins.use(throttlePlugin());
