import express from 'express';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';
import { getAdminDashboard } from '../controllers/adminController.js';

const router = express.Router();

router.use(authenticateToken, authorizeRole('ADMIN'));
router.get('/dashboard', getAdminDashboard);

export default router;
