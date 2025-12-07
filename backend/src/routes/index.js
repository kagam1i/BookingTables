import express from 'express';
import authRoutes from './authRoutes.js';
import bookingRoutes from './bookingRoutes.js';

const router = express.Router();

router.use(authRoutes);
router.use(bookingRoutes);

export default router;