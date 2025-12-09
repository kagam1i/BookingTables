import sqlite3 from 'sqlite3';


const db = new sqlite3.Database(':memory:');

// Создание нового person
const createPerson = (email, password, callback) => {
  if (!email || !password) {
    return callback(new Error('Email and password are required'), null);
  }
  db.run(
    `INSERT INTO person (email, password) VALUES (?, ?)`,
    [email, password],
    function (err) {
      if (err) return callback(err, null);
      callback(null, this.lastID);
    }
  );
};

// Нахождение person по email + password
const authPerson = (email, password, callback) => {
  db.get(
    `SELECT person_id, email FROM person WHERE email = ? AND password = ?`,
    [email, password],
    (err, row) => {
      if (err) return callback(err, null);
      callback(null, row || null); 
    }
  );
};


// Проверка на существование email в таблице person
const isPersonExists = (email, callback) => {
  db.get(
    `SELECT email FROM person WHERE email = ?`,
    [email],
    (err, row) => {
      if (err) return callback(err, null);
      callback(null, !!row);
    }
  );
};

//  Нахождение person по email
const getPersonByEmail = (email, callback) => {
  db.get(
    `SELECT person_id, email FROM person WHERE email = ?`,  
    [email],
    (err, row) => {
      if (err) return callback(err, null);
      callback(null, row || null);
    }
  );
}


// Создание бронирования и связка с выбранными столами
const createBooking = (
  person_id,
  name_of_reservator,
  start_time,
  end_time,
  tables,
  callback
) => {
  db.run(
    `
    INSERT INTO booking (person_id, name_of_reservator, start_time_booking, end_time_booking, status_booking)
    VALUES (?, ?, ?, ?, 'confirmed')
    `,
    [person_id, name_of_reservator, start_time, end_time],
    function (err) {
      if (err) return callback(err, null);

      const booking_id = this.lastID;

      tables.forEach((table_id) => {
        db.run(
          `INSERT INTO bookingTable (booking_id, table_id) VALUES (?, ?)`,
          [booking_id, table_id]
        );
      });

      callback(null, booking_id);
    }
  );
};


// Проверка доступности столов на указанный период
const checkReservation = (table_ids, start, end, callback) => {
  const placeholders = table_ids.map(() => '?').join(',');

  db.all(
    `
    SELECT bt.table_id
    FROM bookingTable bt
    JOIN booking b ON bt.booking_id = b.booking_id
    WHERE bt.table_id IN (${placeholders})
      AND b.status_booking = 'confirmed'
      AND (
        (b.start_time_booking < ? AND b.end_time_booking > ?)
        OR (b.start_time_booking < ? AND b.end_time_booking > ?)
      )
    `,
    [...table_ids, end, start, end, start],
    (err, rows) => {
      if (err) return callback(err, null);

      if (rows.length > 0) {
        return callback(null, {
          available: false,
          bookedTables: rows.map((r) => r.table_id),
        });
      }

      callback(null, { available: true, bookedTables: [] });
    }
  );
};

// Таблицы
const getAllTables = (callback) => {
  db.all(`SELECT * FROM tablePlace`, [], (err, rows) => {
    if (err) return callback(err, null);
    callback(null, rows);
  });
};

// Занятые столы в пересекающемся интервале времени
const getTakenTableIdsForInterval = (start, end, callback) => {
  db.all(
    `
    SELECT DISTINCT bt.table_id
    FROM bookingTable bt
    JOIN booking b ON bt.booking_id = b.booking_id
    WHERE b.status_booking = 'confirmed'
      AND b.start_time_booking < ?
      AND b.end_time_booking > ?
    `,
    [end, start],
    (err, rows) => {
      if (err) return callback(err, null);
      const ids = rows.map((row) => row.table_id);
      callback(null, ids);
    }
  );
};


// Бронирования
const getAllBookings = (callback) => {
  db.all(`SELECT * FROM booking ORDER BY created_at DESC`, [], (err, rows) => {
    if (err) return callback(err, null);
    callback(null, rows);
  });
};
// Персоны
const getAllPersons = (callback) => {
  db.all(`SELECT person_id, email FROM person`, [], (err, rows) => {
    if (err) return callback(err, null);
    callback(null, rows);
  });
};

const changeStatusBooking = (booking_id, new_status, callback) => {
  db.run(
    `UPDATE booking SET status_booking = ? WHERE booking_id = ?`,
    [new_status, booking_id],
    (err) => {
      if (err) return callback(err);
      callback(null);
    }
  );
};


db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS person (
      person_id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tablePlace (
      table_id INTEGER PRIMARY KEY AUTOINCREMENT,
      table_number INTEGER NOT NULL UNIQUE,
      number_of_guests INTEGER NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS booking (
      booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
      person_id INTEGER NOT NULL,
      name_of_reservator TEXT NOT NULL,
      start_time_booking TEXT NOT NULL,
      end_time_booking TEXT NOT NULL,
      status_booking TEXT NOT NULL DEFAULT 'unconfirmed',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (person_id) REFERENCES person(person_id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS bookingTable (
      booking_table_id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER NOT NULL,
      table_id INTEGER NOT NULL,
      FOREIGN KEY (booking_id) REFERENCES booking(booking_id),
      FOREIGN KEY (table_id) REFERENCES tablePlace(table_id)
    )
  `);

  db.run(`
    INSERT INTO tablePlace (table_number, number_of_guests)
    VALUES 
      (1,1),(2,2),(3,4),(4,4),(5,6),(6,8),(7,10)
  `);
});

export default {
  createPerson,
  authPerson,
  isPersonExists,
  getPersonByEmail,
  createBooking,
  checkReservation,
  getAllTables,
  getAllBookings,
  getAllPersons,
  changeStatusBooking,
  getTakenTableIdsForInterval,
};
