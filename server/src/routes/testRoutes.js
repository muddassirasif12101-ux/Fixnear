import express from 'express';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';
import { providerProtected } from '../controllers/providerController.js';
import { adminProtected } from '../controllers/adminProtectedController.js';

const router = express.Router();

router.get('/protected', authenticateToken, (req, res) => {
  res.json({ success: true, data: { message: 'Authenticated access allowed', user: req.user } });
});

router.get('/provider', authenticateToken, authorizeRole('PROVIDER'), providerProtected);
router.get('/admin', authenticateToken, authorizeRole('ADMIN'), adminProtected);

export default router;
