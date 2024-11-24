import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "./PlaceOrder.css";
import { useLocation, useNavigate } from "react-router-dom";
import { assets, food_list } from "../../assets/assets";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Utility function to validate phone number
const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^(09|\+639)\d{9}$/;
  return phoneRegex.test(phone);
};

// Utility function to validate date
const isValidDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

const generateReferenceCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const ReferenceCodeModal = ({ show, referenceCode, onClose }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="reference-modal">
        <h2>Reservation Submitted Successfully!</h2>
        <p>Your reference code is: {referenceCode}</p>
        <p>Please save this code for future reference.</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const PlaceOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedItems: initialSelectedItems = [] } = location.state || {};

  // Form Data State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    paxOptions: "",
    note: "",
    address: "",
    date: "",
    timeSlots: "",
  });

  // Other States
  const [selectedItems, setSelectedItems] = useState(initialSelectedItems);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedPax, setSelectedPax] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [showCancellationWarning, setShowCancellationWarning] = useState(false);
  const [showFoodMenu, setShowFoodMenu] = useState(false);
  const [showReferenceModal, setShowReferenceModal] = useState(false);
  const [referenceCode, setReferenceCode] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    province: "Bohol",
  });
  const [availableFoodItems, setAvailableFoodItems] = useState(
    food_list.filter((item) => !initialSelectedItems.includes(item))
  );

  // Constants
  const timeSlots = [
    { label: "Lunch (11:00 AM - 12:00 PM)", value: "lunch" },
    { label: "Early Dinner (4:00 PM - 5:00 PM)", value: "early-dinner" },
    { label: "Dinner (5:00 PM - 7:00 PM)", value: "dinner" },
  ];

  const cities = [
    "Albur",
    "Baclayon",
    "Balilihan",
    "Corella",
    "Cortes",
    "Dauis",
    "Loay",
    "Loon",
    "Maribojoc",
    "Panglao",
    "Tagbilaran",
  ];

  const paxOptions = Array.from({ length: 101 }, (_, i) => 50 + i + " pax");

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    calculateSubtotal();
  }, [selectedItems, selectedPax]);

  const calculateSubtotal = () => {
    const baseAmount = 17500;
    const pax = parseInt(selectedPax.split(" ")[0]) || 50;
    const paxTotal = baseAmount + (pax - 50) * 350;
    const additionalItemsCost = selectedItems.length * 35 * pax;
    const total = paxTotal + additionalItemsCost;
    setSubtotal(total);
  };

  const handleAddFoodItem = (item) => {
    setSelectedItems((prev) => [...prev, item]);
    setAvailableFoodItems((prev) =>
      prev.filter((foodItem) => foodItem !== item)
    );
    setShowFoodMenu(false);
  };

  const handleFoodItemRemove = (itemToRemove) => {
    setSelectedItems((prev) => prev.filter((item) => item !== itemToRemove));
    setAvailableFoodItems((prev) => [...prev, itemToRemove]);
  };

  // Replace only the handleSubmit function in your code with this version:
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newReferenceCode = generateReferenceCode();
    setReferenceCode(newReferenceCode);

    const errors = {};
    if (!selectedDate) errors.selectedDate = "Date is required";
    if (!selectedTimeSlot) errors.selectedTimeSlot = "Time slot is required";
    if (!selectedPax) errors.selectedPax = "Number of pax is required";
    if (!address.street) errors.street = "Street address is required";
    if (!address.city) errors.city = "City is required";
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.phoneNumber) errors.phoneNumber = "Phone number is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all required fields", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    try {
      const reservationData = {
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),
        customerPhone: formData.phoneNumber,
        pax: parseInt(selectedPax),
        address: {
          street: address.street,
          city: address.city,
          province: address.province,
        },
        date: selectedDate.toISOString(),
        timeSlot: selectedTimeSlot,
        note: formData.note,
        selectedItems: selectedItems.map((item) => ({
          id: item.id || item._id,
          name: item.name,
        })),
        subtotal: subtotal,
        status: "pending",
        referenceCode: newReferenceCode,
      };

      const response = await fetch(`${API_BASE_URL}/api/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(reservationData),
      });

      if (!response.ok) {
        throw new Error("Failed to create reservation");
      }

      const data = await response.json();

      await fetch(`${API_BASE_URL}/api/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          reservationId: data._id,
          referenceCode: newReferenceCode,
          type: "reservation_created",
          message: `Your reservation has been submitted and is pending approval. Reference Code: ${newReferenceCode}`,
          status: "unread",
        }),
      });

      localStorage.setItem("lastReferenceCode", newReferenceCode);
      setShowReferenceModal(true);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create reservation. Please try again.", {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };

  // Navigate after showing the toast
  const handleCloseReferenceModal = () => {
    setShowReferenceModal(false);
    navigate("/", { replace: true });
  };

  const handleCancelReservation = () => {
    setShowCancellationWarning(true);
  };

  const confirmCancelReservation = () => {
    setShowCancellationWarning(false);
    navigate("/");
  };

  const cancelCancelReservation = () => {
    setShowCancellationWarning(false);
  };

  const handleReturn = () => {
    navigate(-1);
  };

  return (
    <form className="place-order" onSubmit={handleSubmit}>
      <div className="place-order-left">
        <img onClick={handleReturn} src={assets.back_icon} alt="Back" />
        <p className="title">Reservation Informations</p>
        <div className="multi-fields">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="First Name"
            required
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Last Name"
            required
          />
        </div>

        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          placeholder="Phone no."
          required
          style={{ width: "150px" }}
        />

        <select
          value={selectedPax}
          onChange={(e) => setSelectedPax(e.target.value)}
          className="pax-select"
          required
        >
          <option value="">No. of pax</option>
          {paxOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {formErrors.selectedPax && (
          <span style={{ color: "red" }}>{formErrors.selectedPax}</span>
        )}

        <div className="select-date">
          <div className="place-order-center">
            <p className="title-venue">Venue</p>
            <div className="multi-fields">
              <input
                className="street"
                type="text"
                name="street"
                value={address.street}
                onChange={handleAddressChange}
                placeholder="Street"
                required
              />

              <select
                name="city"
                value={address.city}
                onChange={handleAddressChange}
                required
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="province"
                value={address.province}
                onChange={handleAddressChange}
                readOnly
              />
            </div>
          </div>

          <p className="title-date">Select Date</p>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="date-select"
            placeholderText="Click to select a date"
            dateFormat="MMMM dd, yyyy"
            required
          />
          {formErrors.selectedDate && (
            <span style={{ color: "red" }}>{formErrors.selectedDate}</span>
          )}

          <p className="title-time">Select Time Slot</p>
          <select
            value={selectedTimeSlot}
            onChange={(e) => setSelectedTimeSlot(e.target.value)}
            className="time-slot-select"
            required
          >
            <option value="">Select a time slot</option>
            {timeSlots.map((slot) => (
              <option key={slot.value} value={slot.value}>
                {slot.label}
              </option>
            ))}
          </select>
          {formErrors.selectedTimeSlot && (
            <span style={{ color: "red" }}>{formErrors.selectedTimeSlot}</span>
          )}

          <div className="note-container">
            <textarea
              className="note-input"
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              placeholder="Leave your note here..."
            ></textarea>
          </div>
        </div>
      </div>

      <div className="place-order-right">
        <div className="order-total">
          <p className="title">Order Summary</p>
          <div className="selected-items-list">
            <div className="selected-items-header">
              <p className="selected-items">Selected Items:</p>
              <button
                type="button"
                className="add-food-btn"
                onClick={() => setShowFoodMenu(true)}
              >
                Add Item
              </button>
            </div>
            <ul>
              {selectedItems.length > 0 ? (
                selectedItems.map((item, index) => (
                  <li key={index}>
                    <span className="food-name">{item.name}</span>
                    <span className="dots"></span>
                    <button
                      type="button"
                      className="remove-item"
                      onClick={() => handleFoodItemRemove(item)}
                    >
                      <img src={assets.cross_icon} alt="" />
                    </button>
                  </li>
                ))
              ) : (
                <p>
                  <strong>No items selected</strong>
                </p>
              )}
            </ul>
          </div>
          <hr />
          <div className="subtotal-section">
            <p className="subtotal">
              Subtotal: PHP {subtotal.toLocaleString()}
            </p>
            {selectedPax && selectedItems.length > 0 && (
              <p className="price-breakdown">
                Additional items cost: PHP{" "}
                {(
                  selectedItems.length *
                  35 *
                  parseInt(selectedPax)
                ).toLocaleString()}
                <br />
                <small>
                  (PHP 35 × {selectedItems.length} items × {selectedPax})
                </small>
              </p>
            )}
          </div>
          <div className="total-section">
            <p className="total">Total: PHP {subtotal.toFixed(2)}</p>
          </div>
          <div className="summary-button">
            <button
              className="cancel-button"
              onClick={handleCancelReservation}
              type="button"
            >
              CANCEL RESERVATION
            </button>
            <button className="payment-button" type="submit">
              CONFIRM RESERVATION
            </button>
          </div>
        </div>
      </div>

      {showFoodMenu && (
        <div className="modal-overlay" onClick={() => setShowFoodMenu(false)}>
          <div className="food-menu-modal" onClick={(e) => e.stopPropagation()}>
            <div className="food-menu-content">
              <h2>Select Additional Food Items</h2>
              <ul className="available-items-list">
                {availableFoodItems.map((item, index) => (
                  <li key={index} className="available-item">
                    <span>{item.name}</span>
                    <button
                      type="button"
                      className="add-item-btn"
                      onClick={() => handleAddFoodItem(item)}
                    >
                      Add
                    </button>
                  </li>
                ))}
              </ul>
              <button
                className="close-menu-btn"
                onClick={() => setShowFoodMenu(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ReferenceCodeModal
        show={showReferenceModal}
        referenceCode={referenceCode}
        onClose={handleCloseReferenceModal}
      />

      {showCancellationWarning && (
        <div className="modal-overlay" onClick={cancelCancelReservation}>
          <div
            className="cancellation-warning-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <h2>Are you sure you want to cancel the reservation?</h2>
              <div className="modal-buttons">
                <button
                  type="button"
                  className="confirm-cancel-btn"
                  onClick={confirmCancelReservation}
                >
                  Yes, Cancel
                </button>
                <button
                  type="button"
                  className="go-back-btn"
                  onClick={cancelCancelReservation}
                >
                  No, Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default PlaceOrder;
