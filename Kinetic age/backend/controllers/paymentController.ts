import { Response } from 'express';
import { dbStore } from '../database/store';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getMyPayments = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw new Error('Unauthorized');
  const payments = dbStore.getPaymentsByUser(req.user.id);
  return res.json(new ApiResponse(200, payments, 'Payment history retrieved.'));
});

export const getAllPaymentsAdmin = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const payments = dbStore.getAllPayments();
  return res.json(new ApiResponse(200, payments, 'All payments ledger retrieved.'));
});
