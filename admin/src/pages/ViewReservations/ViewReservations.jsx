import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ViewReservations.css";
import { useNavigate } from "react-router-dom";

const ViewReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchReservations();
  }, [navigate]);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/reservations", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid or expired
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      toast.error("Failed to load reservations.");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptReservation = async (reservationId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/reservations/${reservationId}/accept`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        throw new Error("Failed to accept reservation.");
      }

      toast.success("Reservation accepted and notification sent.");
      fetchReservations();
    } catch (error) {
      console.error("Error accepting reservation:", error);
      toast.error("Failed to accept reservation.");
    }
  };

  const formatAddress = (address) => {
    if (!address) return "Address not available";
    const parts = [address.street, address.city, address.province].filter(
      Boolean
    );
    return parts.length > 0 ? parts.join(", ") : "Address not available";
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="reservations-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <h2 className="reservations-title">Reservations</h2>
      <div className="reservations-grid">
        {reservations.map((reservation) => (
          <div key={reservation._id} className="reservation-card">
            <div className="reservation-content">
              <div className="reservation-details">
                <p>
                  <span className="label">Customer Name:</span>{" "}
                  {reservation.customerName}
                </p>
                <p>
                  <span className="label">Date:</span>{" "}
                  {new Date(reservation.date).toLocaleDateString()}
                </p>
                <p>
                  <span className="label">Time Slot:</span>{" "}
                  {reservation.timeSlot}
                </p>
                <p>
                  <span className="label">Pax:</span> {reservation.pax}
                </p>
                <p>
                  <span className="label">Address:</span>{" "}
                  {formatAddress(reservation.address)}
                </p>
              </div>
              <div className="reservation-items">
                <p className="label">Selected Items:</p>
                <ul className="items-list">
                  {reservation.selectedItems?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <p>
                  <span className="label">Subtotal:</span> ₱
                  {reservation.subtotal?.toLocaleString()}
                </p>
                {!reservation.accepted && (
                  <button
                    onClick={() => handleAcceptReservation(reservation._id)}
                    className="accept-button"
                  >
                    Accept Reservation
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewReservations;
