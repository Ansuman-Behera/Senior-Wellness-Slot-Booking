import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiResponse';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  console.error(`[Error] ${req.method} ${req.url} - Status: ${statusCode} - ${message}`);

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
  });
};
