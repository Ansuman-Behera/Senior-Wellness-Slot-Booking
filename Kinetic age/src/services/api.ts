import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const TOKEN_KEY = 'kineticage_auth_token';

export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeStoredToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Create centralized Axios instance
export const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject JWT token into Authorization header
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStoredToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Consistent error handling & token cleanup on 401
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      removeStoredToken();
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred.';
    return Promise.reject(new Error(message));
  }
);

/**
 * Universal apiRequest wrapper using Axios for backward compatibility and simple usage.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const method = (options.method || 'GET').toLowerCase();
  let data: any;

  if (options.body) {
    try {
      data = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
    } catch {
      data = options.body;
    }
  }

  const response = await api.request<any>({
    url: endpoint,
    method,
    data,
    headers: options.headers as Record<string, string>,
  });

  const resData = response.data;
  return resData && resData.data !== undefined ? resData.data : resData;
}

export default api;
