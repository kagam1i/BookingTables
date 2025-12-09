import { apiClient } from "./apiClient";
import { bookingService } from "../services/bookingService";

// вспомогательная функция: прибавить к дате/времени 2 часа
function buildEndTime(startDateTime) {
  const start = new Date(startDateTime);
  const end = new Date(start);
  end.setHours(end.getHours() + 2);
  return end.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
}

export const bookingApi = {
  // получить столы с бэка
  async getTables() {
    const tables = await apiClient.get("/tables");
    return { tables };
  },

  // свободные столы на дату/время — через /availability
  async getAvailability(date, time, durationHours = 2) {
    const params = new URLSearchParams({
      date,
      time,
      durationHours: String(durationHours),
    });

    // бэк вернёт { availableTables, takenTableIds, start_time_booking, end_time_booking }
    return apiClient.get(`/availability?${params.toString()}`);
  },

  // создаём бронь в БД + можно сохранить "тень" в localStorage
  async createBooking(draft) {
    // draft приходит из Booking.jsx: { name, phone, date, time, guests, tableIds, ... }

    const start_time_booking = `${draft.date}T${draft.time}`;
    const end_time_booking = buildEndTime(start_time_booking);

    const body = {
      name_of_reservator: draft.name,
      start_time_booking,
      end_time_booking,
      tables: draft.tableIds,
    };

    // создаём бронь в БД
    const response = await apiClient.post("/bookings", body);

    const bookingId = response.bookingId ?? response.booking_id;

    const booking = {
      id: String(bookingId),
      status: "confirmed",
      ...draft,
      createdAt: Date.now(),
    };

    // по желанию — дублируем в localStorage
    bookingService.save(booking);

    return { booking };
  },

  // изменить статус брони в БД + обновить локальный кеш
  async changeStatus(id, newStatus) {
    await apiClient.patch(`/bookings/${id}/status`, { newStatus });
    bookingService.updateStatus(String(id), newStatus);
    return { ok: true };
  },

  // получить все брони из БД (для AdminBookings)
  async getAllBookings() {
    const bookings = await apiClient.get("/bookings");
    return { bookings };
  },
};
