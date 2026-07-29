import { apiRequest } from './api';
import { Payment } from '../types';

export const paymentService = {
  async getMyPayments(): Promise<Payment[]> {
    return apiRequest<Payment[]>('/api/payments/my');
  },

  async getAllPaymentsAdmin(): Promise<Payment[]> {
    return apiRequest<Payment[]>('/api/payments/admin/all');
  },
};
