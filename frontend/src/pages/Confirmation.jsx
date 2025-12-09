import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Container from "../components/layout/Container";
import { bookingApi } from "../api/bookingApi";

function Confirmation() {
  const location = useLocation();
  const bookingId = location.state?.bookingId;

  const [status, setStatus] = useState("confirmed"); // локальный статус для отображения
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const handleCancel = async () => {
    if (!bookingId) return;
    try {
      setUpdating(true);
      setError("");

      await bookingApi.changeStatus(bookingId, "cancelled");

      setStatus("cancelled");
    } catch (err) {
      setError(err?.message || "Failed to cancel booking.");
    } finally {
      setUpdating(false);
    }
  };

  if (!bookingId) {
    return (
      <main className="py-16">
        <Container>
          <div className="max-w-md mx-auto bg-white shadow-md rounded-2xl p-6 text-center">
            <h1 className="h-title mb-3">Reservation</h1>
            <p className="text-gray-600 mb-6">
              Booking information is not available.
            </p>
            <Link to="/" className="btn-primary px-6 py-2">
              Back to Home
            </Link>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="py-16">
      <Container>
        <div className="max-w-md mx-auto bg-white shadow-md rounded-2xl p-6 text-center">
          <h1 className="h-title mb-2">
            Reservation {status === "cancelled" ? "Cancelled" : "Confirmed"}
          </h1>

          <p className="mb-2 text-gray-700">
            Booking ID: <span className="font-mono">{bookingId}</span>
          </p>

          <p className="text-gray-600 mb-4">
            {status === "cancelled"
              ? "Your booking has been cancelled."
              : "We look forward to welcoming you."}
          </p>

          {error && (
            <p className="text-xs text-red-500 mb-3">{error}</p>
          )}

          {status !== "cancelled" && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={updating}
              className="text-xs text-red-500 border border-red-300 px-3 py-1 rounded-full hover:bg-red-50 transition disabled:opacity-60 mb-4"
            >
              {updating ? "Cancelling..." : "Cancel booking"}
            </button>
          )}

          <div>
            <Link to="/" className="btn-primary px-6 py-2">
              Back to Home
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}

export default Confirmation;
