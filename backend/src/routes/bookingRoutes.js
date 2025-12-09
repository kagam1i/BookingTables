import express from 'express';
import {
    getTables,
    getBookings,
    createBooking,
    changeStatus,
    getAvailability
} from '../controllers/bookingController.js';
import {requirePersonAuth} from '../middleware/auth.js';


const router = express.Router();

router.get('/tables', getTables);
router.get('/availability', getAvailability);
router.get('/bookings',requirePersonAuth, getBookings);
router.post('/bookings', requirePersonAuth, createBooking);
router.patch('/bookings/:id/status',requirePersonAuth, changeStatus);

export default router;