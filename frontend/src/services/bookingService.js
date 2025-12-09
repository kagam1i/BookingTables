const STORAGE_KEY = "seatify_bookings";

function loadBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveBookings(bookings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export const bookingService = {
  getAll() {
    return loadBookings();
  },

  save(booking) {
    const bookings = loadBookings();
    bookings.push(booking);
    saveBookings(bookings);
  },

  updateStatus(id, newStatus) {
    const bookings = loadBookings();
    const idx = bookings.findIndex((b) => b.id === id);
    if (idx === -1) return;

    bookings[idx] = {
      ...bookings[idx],
      status: newStatus,
    };

    saveBookings(bookings);
  },

  getByDateTime(date, time) {
    const bookings = loadBookings();
    return bookings.filter((b) => b.date === date && b.time === time);
  },

  // все занятые table_id на дату/время
  getUnavailableTableIds(date, time) {
    const bookings = this.getByDateTime(date, time);

    // берём только не отменённые бронирования
    const ids = bookings
      .filter((b) => b.status !== "cancelled")
      .flatMap((b) => b.tableIds || []);

    // по желанию можно убрать дубли
    return Array.from(new Set(ids));
  },

  // свободные таблицы из allTables
  getAvailableTables(date, time, allTables) {
    const busyIds = this.getUnavailableTableIds(date, time);
    return allTables.filter((t) => !busyIds.includes(t.table_id));
  },
};
