import db from '../database/db.js';

// GET/tables - список всех столиков
export const getTables = async (req, res, next) => {
    db.getAllTables((err, rows) => {
        if (err) return next(err);
        res.json(rows);
    });
};

// GET/bookings - список всех бронирований
export const getBookings = async (req, res, next) => {
    db.getAllBookings((err, rows) => {
        if (err) return next(err);
        res.json(rows);
    });
};

// POST/bookings - создать новое бронирование
export const createBooking = (req, res, next) => {
    const { name_of_reservator, start_time_booking, end_time_booking, tables} = req.body;

    if (!req.person) {
        return res.status(401).json({ message: 'Authorization required' });
    }

    const pesonId = req.person.peson_id;


    db.checkReservation(
        tables,
        start_time_booking,
        end_time_booking,
        (err, result) => {
            if (err) return next(err);

            if (!result.available) {
                return res.status(400).json(result);
            }

            db.createBooking(
                personId,
                name_of_reservator,
                start_time_booking,
                end_time_booking,
                tables,
                (err2, bookingId) => {
                    if (err2) return next(err2);
                    res.status(201).json({
                        message: 'Booking created successfully',
                        bookingId, 
                        });
                }
            );
        }   
    );
}


// PATCH/bookings/:id/status - смена статуса бронирования
export const changeStatus = (req, res, next) => {
    const {id} = req.params;
    const { newStatus } = req.body;

    db.changeStatusBooking(id, newStatus, (err) => {
        if (err) return next(err);
        res.json({ message: 'Booking status updated successfully' });
    });
};