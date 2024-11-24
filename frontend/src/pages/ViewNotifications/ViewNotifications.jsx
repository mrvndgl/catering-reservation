import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./ViewNotifications.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const ViewNotifications = () => {
  const navigate = useNavigate();
  const [referenceCode, setReferenceCode] = useState("");
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTimeSlot = (timeSlot) => {
    const timeSlotMap = {
      lunch: "Lunch (11:00 AM - 12:00 PM)",
      "early-dinner": "Early Dinner (4:00 PM - 5:00 PM)",
      dinner: "Dinner (5:00 PM - 7:00 PM)",
    };
    return timeSlotMap[timeSlot] || timeSlot;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/reservations/reference/${referenceCode}`
      );

      if (!response.ok) {
        throw new Error("Reservation not found");
      }

      const data = await response.json();
      setReservation(data);
    } catch (err) {
      setError("Invalid reference code or reservation not found");
      toast.error("Invalid reference code or reservation not found", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      pending: "status-pending",
      confirmed: "status-confirmed",
      cancelled: "status-cancelled",
      completed: "status-completed",
    };
    return `status-badge ${statusClasses[status] || "status-default"}`;
  };

  const handleReturn = () => {
    navigate("/");
  };

  return (
    <div className="container">
      <div className="content-wrapper">
        <button onClick={handleReturn} className="back-button">
          <svg
            className="back-icon"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        <div className="card">
          <h2 className="card-title">View Reservation Details</h2>

          <form onSubmit={handleSubmit} className="search-form">
            <div className="search-container">
              <input
                type="text"
                value={referenceCode}
                onChange={(e) => setReferenceCode(e.target.value.toUpperCase())}
                placeholder="Enter Reference Code"
                className="search-input"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="submit-button"
              >
                {loading ? "Loading..." : "View Details"}
              </button>
            </div>
          </form>

          {reservation && (
            <div className="reservation-details">
              <div className="section">
                <h3 className="section-title">Reservation Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <p className="label">Reference Code</p>
                    <p className="value">{reservation.referenceCode}</p>
                  </div>
                  <div className="info-item">
                    <p className="label">Status</p>
                    <span className={getStatusClass(reservation.status)}>
                      {reservation.status.charAt(0).toUpperCase() +
                        reservation.status.slice(1)}
                    </span>
                  </div>
                  <div className="info-item">
                    <p className="label">Customer Name</p>
                    <p className="value">{reservation.customerName}</p>
                  </div>
                  <div className="info-item">
                    <p className="label">Phone Number</p>
                    <p className="value">{reservation.customerPhone}</p>
                  </div>
                  <div className="info-item">
                    <p className="label">Date</p>
                    <p className="value">{formatDate(reservation.date)}</p>
                  </div>
                  <div className="info-item">
                    <p className="label">Time Slot</p>
                    <p className="value">
                      {formatTimeSlot(reservation.timeSlot)}
                    </p>
                  </div>
                  <div className="info-item">
                    <p className="label">Number of Pax</p>
                    <p className="value">{reservation.pax} pax</p>
                  </div>
                  <div className="info-item">
                    <p className="label">Total Amount</p>
                    <p className="value">
                      ₱ {reservation.subtotal.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="section">
                <h3 className="section-title">Venue Details</h3>
                <p className="venue-address">
                  {reservation.address.street}, {reservation.address.city},{" "}
                  {reservation.address.province}
                </p>
              </div>

              <div className="section">
                <h3 className="section-title">Selected Items</h3>
                <ul className="items-list">
                  {reservation.selectedItems.map((item, index) => (
                    <li key={index} className="item">
                      • {item.name}
                    </li>
                  ))}
                </ul>
              </div>

              {reservation.note && (
                <div className="section notes-section">
                  <h3 className="section-title">Additional Notes</h3>
                  <p className="note-text">{reservation.note}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewNotifications;
