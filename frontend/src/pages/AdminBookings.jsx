// src/pages/AdminBookings.jsx
import React, { useEffect, useState } from "react";
import { bookingApi } from "../api/bookingApi";
import Container from "../components/layout/Container";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setServerError("");
      const { bookings } = await bookingApi.getAllBookings();
      setBookings(bookings);
    } catch (err) {
      setServerError(err?.message || "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleChangeStatus = async (bookingId, newStatus) => {
    try {
      setUpdatingId(bookingId);
      setServerError("");

      await bookingApi.changeStatus(bookingId, newStatus);

      // обновление локального списка
      setBookings((prev) =>
        prev.map((b) =>
          b.booking_id === bookingId
            ? { ...b, status_booking: newStatus }
            : b
        )
      );
    } catch (err) {
      setServerError(err?.message || "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <main className="py-10">
      <Container>
        <h1 className="h-title mb-4">Admin · Bookings</h1>

        {serverError && (
          <p className="text-sm text-red-500 mb-4">{serverError}</p>
        )}

        {loading ? (
          <p className="text-sm text-gray-600">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-sm text-gray-600">No bookings yet.</p>
        ) : (
          <div className="bg-white rounded-2xl shadow-md border border-restaurant-cream/70 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-restaurant-cream/60">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Start</th>
                  <th className="px-4 py-2 text-left">End</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.booking_id} className="border-t">
                    <td className="px-4 py-2 font-mono text-xs">
                      {b.booking_id}
                    </td>
                    <td className="px-4 py-2">{b.name_of_reservator}</td>
                    <td className="px-4 py-2">{b.start_time_booking}</td>
                    <td className="px-4 py-2">{b.end_time_booking}</td>
                    <td className="px-4 py-2">
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-restaurant-cream/70">
                        {b.status_booking}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleChangeStatus(b.booking_id, "confirmed")
                          }
                          disabled={updatingId === b.booking_id}
                          className="text-xs border px-2 py-1 rounded-full hover:bg-green-50 border-green-300 text-green-600 disabled:opacity-60"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleChangeStatus(b.booking_id, "cancelled")
                          }
                          disabled={updatingId === b.booking_id}
                          className="text-xs border px-2 py-1 rounded-full hover:bg-red-50 border-red-300 text-red-600 disabled:opacity-60"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleChangeStatus(b.booking_id, "completed")
                          }
                          disabled={updatingId === b.booking_id}
                          className="text-xs border px-2 py-1 rounded-full hover:bg-blue-50 border-blue-300 text-blue-600 disabled:opacity-60"
                        >
                          Completed
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Container>
    </main>
  );
}

export default AdminBookings;
