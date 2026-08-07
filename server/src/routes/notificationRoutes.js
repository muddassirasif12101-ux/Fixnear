import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { getNotifications, markNotificationRead } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', authenticateToken, getNotifications);
router.put('/:notificationId/read', authenticateToken, markNotificationRead);

export default router;
