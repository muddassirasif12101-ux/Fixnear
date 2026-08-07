import express from 'express';
import { login, register, me } from '../controllers/authController.js';
import { loginValidation, registerValidation } from '../middleware/validators.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', authenticateToken, me);

export default router;
