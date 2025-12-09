import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { bookingApi } from "../api/bookingApi";
import Container from "../components/layout/Container";
import TableLayout from "../components/TableLayout";

function Booking() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: 2,
  });



  const [available, setAvailable] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // столы из БД и выбранные столы
  const [tables, setTables] = useState([]);
  const [selectedTableIds, setSelectedTableIds] = useState([]);
  const [unavailableTableIds, setUnavailableTableIds] = useState([]);

  // преобразование формата времени

  const buildStartTime = (date, time) => {
    if (!date || !time) return "";
    return `${date}T${time}`;
  };

  const buildEndTime = (date, time) => {
    if (!date || !time) return "";
    const [h, m] = time.split(":").map(Number);
    const start = new Date(`${date}T${time}`);
    start.setHours(h + 2); 
    return start.toISOString().slice(0, 16); 
  };

  const buildBookingPayload = () => ({
    id: crypto.randomUUID(),
    name: form.name.trim(),
    phone: form.phone.trim(),
    date: form.date,
    time: form.time,
    guests: form.guests,
    tableIds: selectedTableIds,
    createdAt: Date.now(),
  });

  // загрузка столов из БД

  useEffect(() => {
    async function loadTables() {
      try {
        const { tables } = await bookingApi.getTables();
        setTables(tables);
      } catch (e) {
        console.error("Failed to load tables", e);
      }
    }

    loadTables();
  }, []);

  // проверка доступности по дате/времени 

  useEffect(() => {
    let cancelled = false;

    async function updateAvailability() {
      if (!form.date || !form.time) {
        setAvailable(null);
        setUnavailableTableIds([]);
        return;
      }

      try {
        const { availableTables, takenTableIds } =
          await bookingApi.getAvailability(form.date, form.time);

        if (!cancelled) {
          setAvailable(availableTables.length);
          setUnavailableTableIds(takenTableIds || []);
        }
      } catch (e) {
        console.error("Failed to check availability", e);
      }
    }

  

    updateAvailability();

    return () => {
      cancelled = true;
    };
  }, [form.date, form.time]);

  // обработка формы 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "guests" ? Number(value) : value,
    }));
  };

  const handleToggleTable = (tableId) => {
    setSelectedTableIds((prev) =>
      prev.includes(tableId)
        ? prev.filter((id) => id !== tableId)
        : [...prev, tableId]
    );
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    if (!form.date) newErrors.date = "Date is required";
    if (!form.time) newErrors.time = "Time is required";
    if (form.guests <= 0) newErrors.guests = "Guests must be at least 1";

    if (selectedTableIds.length === 0) {
      newErrors.tables = "Please select at least one table";
    }

    if (form.date && form.time && available === 0) {
      newErrors.slot = "No tables available for this time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    try {
      setSubmitting(true);

      const payload = buildBookingPayload();

      // ожидаем, что API вернёт { booking: {...} }
      const { booking } = await bookingApi.createBooking(payload);

      navigate("/confirmation", {
        state: { bookingId: booking.id },
      });
    } catch (err) {
      setServerError(
        err?.message || "Failed to create booking. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };



  return (
    <main className="py-10">
      <Container>
        <header className="mb-6 animate-fade-up">
          <h1 className="h-title mb-1">Book a Table</h1>
          <p className="text-gray-600 text-sm">
            Choose your date, time, number of guests and table.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Левая колонка - форма бронирования */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-md p-6 space-y-4 border border-restaurant-cream/70 animate-scale-in"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border rounded-lg"
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border rounded-lg"
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border rounded-lg"
                />
                {errors.date && (
                  <p className="text-xs text-red-500 mt-1">{errors.date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border rounded-lg"
                />
                {errors.time && (
                  <p className="text-xs text-red-500 mt-1">{errors.time}</p>
                )}
              </div>
            </div>

            {/* Guests */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Guests</label>
                <input
                  type="number"
                  name="guests"
                  min={1}
                  max={20}
                  value={form.guests}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border rounded-lg"
                />
                {errors.guests && (
                  <p className="text-xs text-red-500 mt-1">{errors.guests}</p>
                )}
              </div>
            </div>

            {/* Ошибка по слотам */}
            {errors.slot && (
              <p className="text-xs text-red-500 border border-red-100 bg-red-50 rounded-md px-3 py-2">
                {errors.slot}
              </p>
            )}

            {/* Ошибка сервера */}
            {serverError && (
              <p className="text-xs text-red-500 text-center">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full btn-primary py-2.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Booking..." : "Book a table"}
            </button>
          </form>

          {/* Правая колонка */}
          <div className="space-y-6 animate-fade-up">
            {/* Availability */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-restaurant-cream/70">
              <h2 className="h-subtitle mb-1">Availability</h2>

              {form.date && form.time ? (
                <p className="text-sm text-gray-700">
                  Available tables for{" "}
                  <span className="font-medium">{form.date}</span> at{" "}
                  <span className="font-medium">{form.time}</span>:{" "}
                  <span className="font-semibold">{available ?? "—"}</span>
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  Select date and time to see available tables.
                </p>
              )}
            </div>

            {/* Table layout */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-restaurant-cream/70">
              <h2 className="h-subtitle mb-4">Choose your table(s)</h2>

              <TableLayout
                tables={tables}
                selectedTableIds={selectedTableIds}
                onToggleTable={handleToggleTable}
                unavailableTableIds={unavailableTableIds}
              />
              {errors.tables && (
                <p className="text-xs text-red-500 mt-2">
                  {errors.tables}
                </p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}

export default Booking;
