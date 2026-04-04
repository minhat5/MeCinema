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

  /** FormData cần boundary tự sinh - bỏ application/json mặc định */
  if (config.data instanceof FormData && config.headers) {
    delete config.headers['Content-Type'];
  }

  return config;
});

const toSafeMessage = (value: unknown): string => {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (value instanceof Error && value.message.trim()) return value.message.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
};

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const requestUrl = String(error.config?.url || '');
    const isAuthRequest = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');

    if (status === 401 && !isAuthRequest) {
      localStorage.removeItem('accessToken');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    const responseData = error.response?.data;
    const rawMessage =
      (typeof responseData === 'object' && responseData && (responseData as { message?: unknown }).message) ||
      (Array.isArray((responseData as { errors?: unknown[] } | undefined)?.errors)
        ? (responseData as { errors: unknown[] }).errors[0]
        : undefined) ||
      (typeof responseData === 'string' ? responseData : undefined);

    const resolvedMessage = toSafeMessage(rawMessage);
    const lowerMessage = resolvedMessage.toLowerCase();

    const message =
      status === 401 ||
      lowerMessage.includes('bad credentials') ||
      lowerMessage.includes('invalid credentials') ||
      lowerMessage.includes('username')
        ? 'Sai tài khoản hoặc mật khẩu.'
        : resolvedMessage || 'Đã có lỗi xảy ra. Vui lòng thử lại.';

    return Promise.reject(new Error(message));
  },
);

export default apiClient;
