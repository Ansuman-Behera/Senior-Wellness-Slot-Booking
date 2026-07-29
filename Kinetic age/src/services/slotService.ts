import { apiRequest } from './api';
import { Slot } from '../types';

export const slotService = {
  async getSlots(filters?: { serviceId?: string; date?: string; status?: string }): Promise<Slot[]> {
    const params = new URLSearchParams();
    if (filters?.serviceId) params.append('serviceId', filters.serviceId);
    if (filters?.date) params.append('date', filters.date);
    if (filters?.status) params.append('status', filters.status);

    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest<Slot[]>(`/api/slots${query}`);
  },

  async generate3DaySlots(): Promise<Slot[]> {
    return apiRequest<Slot[]>('/api/slots/generate-3days', { method: 'POST' });
  },

  async createSlot(data: Partial<Slot>): Promise<Slot> {
    return apiRequest<Slot>('/api/slots', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateSlot(id: string, data: Partial<Slot>): Promise<Slot> {
    return apiRequest<Slot>(`/api/slots/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
