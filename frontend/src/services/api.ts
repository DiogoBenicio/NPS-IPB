import axios from 'axios';
import logger from './logger';

const api = axios.create({
  // Default to relative '/api' so it works behind nginx and in dev.
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const meta = {
      url: error?.config?.url,
      method: error?.config?.method,
      status: error?.response?.status,
      message: error?.message,
    };
    logger.error('API error', meta);
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (username: string, password: string) => api.post('/auth/login', { username, password }),
  register: (username: string, password: string) =>
    api.post('/auth/register', { username, password }),
};

// Campaigns
export const campaignsAPI = {
  getAll: () => api.get('/campaigns'),
  getById: (id: string) => api.get(`/campaigns/${id}`),
  getByIdPublic: (id: string) => api.get(`/campaigns/public/${id}`),
  create: (data: {
    name: string;
    description?: string;
    welcomeText?: string;
    questions?: { id: string; text: string; type: 'yes-no' | 'text' }[];
  }) => api.post('/campaigns', data),
  update: (
    id: string,
    data: {
      name?: string;
      description?: string;
      welcomeText?: string;
      isActive?: boolean;
      questions?: { id: string; text: string; type: 'yes-no' | 'text' }[];
    }
  ) => api.put(`/campaigns/${id}`, data),
  delete: (id: string) => api.delete(`/campaigns/${id}`),
};

// Responses
export const responsesAPI = {
  submit: (data: {
    campaignId: string;
    name?: string;
    email?: string;
    score: number;
    comment?: string;
    answers?: { questionId: string; answer: string | boolean }[];
  }) => api.post('/responses', data),
  getAll: () => api.get('/responses'),
  getStats: (campaignId: string) => api.get(`/responses/stats/${campaignId}`),
};

export default api;
