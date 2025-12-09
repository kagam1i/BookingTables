import db from '../database/db.js';


// Достаю email пользователя из cookie и нахожу соответствующего person в БД
export const attachPersonFromCookie = (req, res, next) => {
    const email = req.cookies?.email;
    if (!email) {
        req.person = null;
        return next();
    }

    db.getPersonByEmail(email, (err, person) => {
        if (err) {
            console.error('Error in getPersonByEmail:', err);
            req.person = null;
            return next();
        }

        req.person = person || null;
        next();
    });
};

// Middleware для защиты маршрутов, требующих аутентификации
export const requirePersonAuth = (req, res, next) => {
    if (!req.person) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    next();
};

