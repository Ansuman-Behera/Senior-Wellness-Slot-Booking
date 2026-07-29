import { Request, Response } from 'express';
import { dbStore } from '../database/store';
import { ApiError, ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getServices = asyncHandler(async (req: Request, res: Response) => {
  const services = dbStore.getAllServices();
  return res.json(new ApiResponse(200, services, 'Services retrieved successfully.'));
});

export const getServiceById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const service = dbStore.getServiceById(id);
  if (!service) {
    throw new ApiError(404, 'Service not found.');
  }
  return res.json(new ApiResponse(200, service, 'Service details retrieved.'));
});

export const createService = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, duration, price, category, iconName } = req.body;

  if (!title || !description || !duration || price === undefined) {
    throw new ApiError(400, 'Title, description, duration, and price are required.');
  }

  const newService = dbStore.createService({
    title,
    description,
    duration: Number(duration),
    price: Number(price),
    active: true,
    category: category || 'Wellness',
    iconName: iconName || 'Activity',
  });

  return res.status(201).json(new ApiResponse(201, newService, 'Service created successfully.'));
});

export const updateService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, duration, price, active, category, iconName } = req.body;

  const existing = dbStore.getServiceById(id);
  if (!existing) {
    throw new ApiError(404, 'Service not found.');
  }

  const updated = dbStore.updateService(id, {
    ...(title && { title }),
    ...(description && { description }),
    ...(duration !== undefined && { duration: Number(duration) }),
    ...(price !== undefined && { price: Number(price) }),
    ...(active !== undefined && { active: Boolean(active) }),
    ...(category && { category }),
    ...(iconName && { iconName }),
  });

  return res.json(new ApiResponse(200, updated, 'Service updated successfully.'));
});

export const deleteService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const existing = dbStore.getServiceById(id);
  if (!existing) {
    throw new ApiError(404, 'Service not found.');
  }

  dbStore.deleteService(id);
  return res.json(new ApiResponse(200, null, 'Service deleted successfully.'));
});
