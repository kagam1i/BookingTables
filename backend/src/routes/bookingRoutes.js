import express from 'express';
import {
    getTables,
    getBookings,
    createBooking,
    changeStatus,
} from '../controllers/bookingController.js';
import {requirePersonAuth} from '../middleware/auth.js';


const router = express.Router();

router.get('/tables', getTables);
router.get('/bookings', getBookings);
router.post('/bookings', requirePersonAuth, createBooking);
router.patch('/bookings/:id/status', changeStatus);

export default router;