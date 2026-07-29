import { Router } from 'express';
import { getMyPayments, getAllPaymentsAdmin } from '../controllers/paymentController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/roleMiddleware';

const router = Router();

router.get('/my', authenticateJWT, getMyPayments);
router.get('/admin/all', authenticateJWT, requireAdmin, getAllPaymentsAdmin);

export default router;
