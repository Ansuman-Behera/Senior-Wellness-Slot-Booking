import { Response } from 'express';
import { dbStore } from '../database/store';
import { ApiError, ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const createBooking = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'User must be logged in to book a slot.');
  }

  const { serviceId, slotId, paymentType } = req.body;

  if (!serviceId || !slotId || !paymentType) {
    throw new ApiError(400, 'Service ID, Slot ID, and Payment Type (Prepaid or Cash on Delivery) are required.');
  }

  if (paymentType !== 'Prepaid' && paymentType !== 'Cash on Delivery') {
    throw new ApiError(400, 'Invalid payment type. Must be Prepaid or Cash on Delivery.');
  }

  try {
    // Execute ACID transaction
    const result = await dbStore.executeBookingTransaction({
      userId: req.user.id,
      userName: req.user.name,
      userEmail: req.user.email,
      serviceId,
      slotId,
      paymentType,
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          booking: result.booking,
          payment: result.payment,
        },
        'Booking confirmed successfully!'
      )
    );
  } catch (err: any) {
    const errorMsg = err.message || 'Booking transaction failed';
    if (errorMsg.includes('SLOT_FULLY_BOOKED') || errorMsg.includes('ALREADY_BOOKED')) {
      throw new ApiError(400, errorMsg.replace(/^[A-Z_]+:\s*/, ''));
    }
    if (errorMsg.includes('SLOT_NOT_FOUND') || errorMsg.includes('SERVICE_INACTIVE')) {
      throw new ApiError(404, errorMsg.replace(/^[A-Z_]+:\s*/, ''));
    }
    throw new ApiError(500, `ACID Transaction Aborted: ${errorMsg}`);
  }
});

export const getMyBookings = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Unauthorized.');
  const bookings = dbStore.getBookingsByUser(req.user.id);
  return res.json(new ApiResponse(200, bookings, 'My bookings retrieved successfully.'));
});

export const getAllBookingsAdmin = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const bookings = dbStore.getAllBookings();
  return res.json(new ApiResponse(200, bookings, 'All bookings retrieved successfully.'));
});

export const cancelBooking = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Unauthorized.');
  const { id } = req.params;

  try {
    const isAdmin = req.user.role === 'admin';
    const cancelledBooking = await dbStore.executeCancelBooking(id, req.user.id, isAdmin);
    return res.json(new ApiResponse(200, cancelledBooking, 'Booking cancelled successfully. Seat restored.'));
  } catch (err: any) {
    throw new ApiError(400, err.message ? err.message.replace(/^[A-Z_]+:\s*/, '') : 'Cancellation failed.');
  }
});
