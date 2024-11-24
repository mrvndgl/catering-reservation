import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./ViewReservations.css";

const ViewReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
    timeSlot: "",
  });

  // Fetch reservations
  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/reservations", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reservations");
      }

      const data = await response.json();
      setReservations(data);
      setFilteredReservations(data);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        throw new Error("No authentication token or user ID");
      }

      const response = await fetch(
        `http://localhost:4000/api/notifications/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Could not load notifications");
    }
  };

  // Update reservation status
  const updateReservationStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/reservations/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update reservation status");
      }

      toast.success(`Reservation status updated to ${newStatus}`);
      fetchReservations();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = reservations;

    if (filters.status) {
      filtered = filtered.filter((res) => res.status === filters.status);
    }

    if (filters.startDate) {
      filtered = filtered.filter(
        (res) => new Date(res.date) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(
        (res) => new Date(res.date) <= new Date(filters.endDate)
      );
    }

    if (filters.timeSlot) {
      filtered = filtered.filter((res) => res.timeSlot === filters.timeSlot);
    }

    setFilteredReservations(filtered);
  };

  useEffect(() => {
    fetchReservations();
    fetchNotifications();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, reservations]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderReservationDetails = (reservation) => {
    return (
      <div className="reservation-details">
        <p>
          <strong>Reference Code:</strong> {reservation.referenceCode}
        </p>
        <p>
          <strong>Name:</strong> {reservation.customerName}
        </p>
        <p>
          <strong>Phone:</strong> {reservation.customerPhone}
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(reservation.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Time Slot:</strong> {reservation.timeSlot}
        </p>
        <p>
          <strong>Pax:</strong> {reservation.pax}
        </p>
        <p>
          <strong>Address:</strong>{" "}
          {`${reservation.address.street}, ${reservation.address.city}, ${reservation.address.province}`}
        </p>
        <p>
          <strong>Subtotal:</strong> PHP{" "}
          {reservation.subtotal?.toLocaleString() || "N/A"}
        </p>
        <p>
          <strong>Selected Items:</strong>{" "}
          {reservation.selectedItems?.map((item) => item.name).join(", ") ||
            "No items"}
        </p>
      </div>
    );
  };

  return (
    <div className="view-reservations">
      <h1>Reservation Management</h1>

      {/* Filters */}
      <div className="reservation-filters">
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>

        <select
          name="timeSlot"
          value={filters.timeSlot}
          onChange={handleFilterChange}
        >
          <option value="">All Time Slots</option>
          <option value="lunch">Lunch</option>
          <option value="early-dinner">Early Dinner</option>
          <option value="dinner">Dinner</option>
        </select>

        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          placeholder="Start Date"
        />

        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          placeholder="End Date"
        />
      </div>

      {/* Reservations List */}
      {loading ? (
        <p>Loading reservations...</p>
      ) : (
        <div className="reservations-list">
          {filteredReservations.length === 0 ? (
            <p>No reservations found.</p>
          ) : (
            filteredReservations.map((reservation) => (
              <div key={reservation._id} className="reservation-card">
                <div className="reservation-header">
                  <span className={`status-badge ${reservation.status}`}>
                    {reservation.status.toUpperCase()}
                  </span>
                  <div className="reservation-actions">
                    {reservation.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            updateReservationStatus(
                              reservation._id,
                              "confirmed"
                            )
                          }
                          className="confirm-btn"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() =>
                            updateReservationStatus(
                              reservation._id,
                              "cancelled"
                            )
                          }
                          className="cancel-btn"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {renderReservationDetails(reservation)}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ViewReservations;
