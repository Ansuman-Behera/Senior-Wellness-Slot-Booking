import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  getAllBookingsAdmin,
  cancelBooking,
} from '../controllers/bookingController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/roleMiddleware';

const router = Router();

router.post('/', authenticateJWT, createBooking);
router.get('/my', authenticateJWT, getMyBookings);
router.put('/cancel/:id', authenticateJWT, cancelBooking);

// Admin routes
router.get('/admin/all', authenticateJWT, requireAdmin, getAllBookingsAdmin);

export default router;
