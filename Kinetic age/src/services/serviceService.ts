import { apiRequest } from './api';
import { Service } from '../types';

export const serviceService = {
  async getServices(): Promise<Service[]> {
    return apiRequest<Service[]>('/api/services');
  },

  async getServiceById(id: string): Promise<Service> {
    return apiRequest<Service>(`/api/services/${id}`);
  },

  async createService(data: Partial<Service>): Promise<Service> {
    return apiRequest<Service>('/api/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateService(id: string, data: Partial<Service>): Promise<Service> {
    return apiRequest<Service>(`/api/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteService(id: string): Promise<void> {
    return apiRequest(`/api/services/${id}`, { method: 'DELETE' });
  },
};
