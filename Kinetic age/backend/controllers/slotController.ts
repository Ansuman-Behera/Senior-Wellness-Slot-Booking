import { Request, Response } from 'express';
import { dbStore } from '../database/store';
import { ApiError, ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getSlots = asyncHandler(async (req: Request, res: Response) => {
  const { serviceId, date, status } = req.query;

  const slots = dbStore.getAllSlots({
    serviceId: serviceId ? String(serviceId) : undefined,
    date: date ? String(date) : undefined,
    status: status ? String(status) : undefined,
  });

  // Enrich slot objects with service title if available
  const enrichedSlots = slots.map((slot) => {
    const service = dbStore.getServiceById(slot.serviceId);
    return {
      ...slot,
      serviceTitle: service?.title || 'Senior Service',
      servicePrice: service?.price || 0,
      serviceDuration: service?.duration || 30,
    };
  });

  return res.json(new ApiResponse(200, enrichedSlots, 'Slots retrieved successfully.'));
});

export const createSlot = asyncHandler(async (req: Request, res: Response) => {
  const { serviceId, date, startTime, endTime, capacity } = req.body;

  if (!serviceId || !date || !startTime || !endTime) {
    throw new ApiError(400, 'Service ID, date, start time, and end time are required.');
  }

  const service = dbStore.getServiceById(serviceId);
  if (!service) {
    throw new ApiError(400, 'Invalid Service ID.');
  }

  const slotCapacity = capacity ? Number(capacity) : 3;

  const newSlot = dbStore.createSlot({
    serviceId,
    date,
    startTime,
    endTime,
    capacity: slotCapacity,
  });

  return res.status(201).json(new ApiResponse(201, newSlot, 'Slot created successfully.'));
});

export const generate3DaySlots = asyncHandler(async (req: Request, res: Response) => {
  const generated = dbStore.generate3DaySlotsInternal();
  return res.json(new ApiResponse(200, generated, '3-Day slots regenerated successfully.'));
});

export const updateSlot = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { capacity, status } = req.body;

  const slot = dbStore.getSlotById(id);
  if (!slot) {
    throw new ApiError(404, 'Slot not found.');
  }

  const updated = dbStore.updateSlot(id, {
    ...(capacity !== undefined && { capacity: Number(capacity) }),
    ...(status && { status }),
  });

  return res.json(new ApiResponse(200, updated, 'Slot updated successfully.'));
});
