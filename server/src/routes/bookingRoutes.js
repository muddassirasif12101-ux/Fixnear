import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { createBooking, getBookings, updateBookingStatus } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', authenticateToken, createBooking);
router.get('/', authenticateToken, getBookings);
router.put('/:bookingId/status', authenticateToken, updateBookingStatus);

export default router;
