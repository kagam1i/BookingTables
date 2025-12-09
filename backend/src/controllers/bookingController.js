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

    const personId = req.person.person_id;


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


// GET /availability?date=YYYY-MM-DD&time=HH:MM&durationHours=2
export const getAvailability = (req, res, next) => {
    const { date, time, durationHours = 2 } = req.query;

    if (!date || !time) {
        return res.status(400).json({ message: "Missing 'date' or 'time' query params" });
    }

    const start = new Date(`${date}T${time}`);
    if (Number.isNaN(start.getTime())) {
        return res.status(400).json({ message: "Invalid date or time" });
    }

    const duration = Number(durationHours) || 2;
    const end = new Date(start);
    end.setHours(end.getHours() + duration);

    const toIsoShort = (d) => d.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
    const startStr = toIsoShort(start);
    const endStr = toIsoShort(end);

    db.getTakenTableIdsForInterval(startStr, endStr, (err, takenIds) => {
        if (err) return next(err);

        db.getAllTables((err2, tables) => {
            if (err2) return next(err2);

            const availableTables = tables.filter(
                (table) => !takenIds.includes(table.table_id)
            );

            res.json({
                availableTables,
                takenTableIds: takenIds,
                start_time_booking: startStr,
                end_time_booking: endStr,
            });
        });
    });
};





// PATCH/bookings/:id/status - смена статуса бронирования
export const changeStatus = (req, res, next) => {
    const {id} = req.params;
    const { newStatus } = req.body;

    db.changeStatusBooking(id, newStatus, (err) => {
        if (err) return next(err);
        res.json({ message: 'Booking status updated successfully' });
    });
};