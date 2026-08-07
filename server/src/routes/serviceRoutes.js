import express from 'express';
import { getServices, getServiceCategories } from '../controllers/serviceController.js';

const router = express.Router();

router.get('/', getServices);
router.get('/categories', getServiceCategories);

export default router;
