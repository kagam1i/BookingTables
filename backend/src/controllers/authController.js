import db from '../database/db.js';

// POST /register
export const register = (req, res, next) => {
    const { email, password } = req.body;

    db.createPerson(email, password, (err, personId) => {
        if (err) {
            return next(err);
        }

        res.status(201).json({
            message: 'Registration successful',
            personId,
        });
    });
};


// POST /auth
export const login = (req, res, next) => {
    const { email, password } = req.body;

    db.authPerson(email, password, (err, person) => {
        if (err) return next(err);

        if (!person) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.cookie('email', person.email, {
             httpOnly: true,
             secure: false,
             sameSite: 'lax',
             maxAge: 24 * 60 * 60 * 1000, 
        });
        
        res.json({ message: 'Authentication successful' });
    });
};

// GET /me , т.е я возвращаю информацию о текущем пользователе по куке
export const me = (req, res) => {
    if (!req.person) {
        return res.json({ personId: null, email: null });
    }

    res.json({
         personId: req.person.person_id, 
         email: req.person.email 
        });
};

export const logout = (req, res) => {
  res.clearCookie('email', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
  });
  res.json({ message: 'Logout successful' });
};