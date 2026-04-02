import axios from 'axios';

const rawBaseURL =
  (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/mecinema/api';
const normalizedBaseURL = rawBaseURL.endsWith('/api')
  ? rawBaseURL
  : `${rawBaseURL.replace(/\/+$/, '')}/api`;

const apiClient = axios.create({
  baseURL: normalizedBaseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  // Keep backward compatibility with cookie-based auth marker in localStorage.
  if (token && token !== 'COOKIE_AUTH' && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  /** FormData cần boundary tự sinh — bỏ application/json mặc định */
  if (config.data instanceof FormData && config.headers) {
    delete config.headers['Content-Type'];
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    const responseData = error.response?.data;
    const validationMessage =
      typeof responseData === 'object' && responseData
        ? Array.isArray((responseData as any).errors) && (responseData as any).errors.length > 0
          ? String((responseData as any).errors[0])
          : typeof (responseData as any).data === 'object' && (responseData as any).data
            ? Object.values((responseData as any).data)
                .map((v) => String(v))
                .join(', ')
            : ''
        : '';
    const message =
      (typeof responseData === 'object' && responseData?.message) ||
      validationMessage ||
      (typeof responseData === 'string' &&
      responseData.includes('Cannot') &&
      responseData.includes('/auth/')
        ? 'Sai endpoint API. Hãy kiểm tra VITE_API_URL, cần có /api ở cuối.'
        : '') ||
      'Lỗi hệ thống';

    return Promise.reject(new Error(message));
  },
);

export default apiClient;
