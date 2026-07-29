import { Response } from 'express';
import { dbStore } from '../database/store';
import { ApiError, ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Unauthorized');
  const user = dbStore.findUserById(req.user.id);
  if (!user) throw new ApiError(404, 'User not found');

  const { passwordHash, ...profile } = user;
  return res.json(new ApiResponse(200, profile, 'Profile fetched successfully.'));
});

export const updateProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Unauthorized');

  const { name, phone, age, emergencyContact } = req.body;
  const updated = dbStore.updateUser(req.user.id, {
    ...(name && { name }),
    ...(phone !== undefined && { phone }),
    ...(age !== undefined && { age: Number(age) }),
    ...(emergencyContact !== undefined && { emergencyContact }),
  });

  if (!updated) throw new ApiError(404, 'User not found');

  const { passwordHash, ...profile } = updated;
  return res.json(new ApiResponse(200, profile, 'Profile updated successfully.'));
});

export const getAllUsersAdmin = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const users = dbStore.getAllUsers().map(({ passwordHash, ...u }) => u);
  return res.json(new ApiResponse(200, users, 'Users fetched successfully.'));
});

export const getUserDashboardStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Unauthorized');
  const stats = dbStore.getUserStats(req.user.id);
  return res.json(new ApiResponse(200, stats, 'User dashboard stats retrieved.'));
});

export const getAdminDashboardStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const stats = dbStore.getAdminStats();
  return res.json(new ApiResponse(200, stats, 'Admin dashboard stats retrieved.'));
});
