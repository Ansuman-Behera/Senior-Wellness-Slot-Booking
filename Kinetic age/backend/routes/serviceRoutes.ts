import { Router } from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/roleMiddleware';

const router = Router();

router.get('/', getServices);
router.get('/:id', getServiceById);

// Admin-protected routes
router.post('/', authenticateJWT, requireAdmin, createService);
router.put('/:id', authenticateJWT, requireAdmin, updateService);
router.delete('/:id', authenticateJWT, requireAdmin, deleteService);

export default router;
