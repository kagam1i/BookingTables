import db from '../database/db.js';


// Достаю email пользователя из cookie и нахожу соответствующего person в БД
export const attachUserFromCookie = (req, res, next) => {
    const email = req.cookies?.email;
    if (!email) {
        req.person = null;
        return next();
    }

    db.getPersonByEmail(email, (err, person) => {
        if (err) {
            console.error('Error in getPersonByEmail:', err);
            req.user = null;
            return next();
        }

        req.user = user || null;
        next();
    });
};

// Middleware для защиты маршрутов, требующих аутентификации
export const requireAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    next();
};

