import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  getAllUsersAdmin,
  getUserDashboardStats,
  getAdminDashboardStats,
} from '../controllers/userController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/roleMiddleware';

const router = Router();

router.get('/profile', authenticateJWT, getProfile);
router.put('/profile', authenticateJWT, updateProfile);
router.get('/stats', authenticateJWT, getUserDashboardStats);

// Admin endpoints
router.get('/admin/stats', authenticateJWT, requireAdmin, getAdminDashboardStats);
router.get('/admin/all', authenticateJWT, requireAdmin, getAllUsersAdmin);

export default router;
