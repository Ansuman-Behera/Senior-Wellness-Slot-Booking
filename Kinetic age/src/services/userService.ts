import { apiRequest } from './api';
import { User, UserDashboardStats, AdminDashboardStats } from '../types';

export const userService = {
  async getProfile(): Promise<User> {
    return apiRequest<User>('/api/user/profile');
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    return apiRequest<User>('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async getUserStats(): Promise<UserDashboardStats> {
    return apiRequest<UserDashboardStats>('/api/user/stats');
  },

  async getAdminStats(): Promise<AdminDashboardStats> {
    return apiRequest<AdminDashboardStats>('/api/user/admin/stats');
  },

  async getAllUsersAdmin(): Promise<User[]> {
    return apiRequest<User[]>('/api/user/admin/all');
  },
};
