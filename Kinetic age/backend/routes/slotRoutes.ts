import { Router } from 'express';
import {
  getSlots,
  createSlot,
  generate3DaySlots,
  updateSlot,
} from '../controllers/slotController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/roleMiddleware';

const router = Router();

router.get('/', getSlots);

// Admin routes
router.post('/', authenticateJWT, requireAdmin, createSlot);
router.post('/generate-3days', authenticateJWT, requireAdmin, generate3DaySlots);
router.put('/:id', authenticateJWT, requireAdmin, updateSlot);

export default router;
