import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware';
import { ApiError } from '../utils/apiResponse';

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new ApiError(403, 'Access denied. Admin privileges required.'));
  }
  next();
};
