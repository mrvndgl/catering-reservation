import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./PlaceOrder.css";
import { useLocation, useNavigate } from "react-router-dom";
import { assets, food_list } from "../../assets/assets";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedItems: initialSelectedItems = [] } = location.state || {};

  const [selectedItems, setSelectedItems] = useState(initialSelectedItems);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedPax, setSelectedPax] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [showCancellationWarning, setShowCancellationWarning] = useState(false);

  const timeSlots = [
    { label: "Lunch (11:00 AM - 12:00 PM)", value: "lunch" },
    { label: "Early Dinner (4:00 PM - 5:00 PM)", value: "early-dinner" },
    { label: "Dinner (5:00 PM - 7:00 PM)", value: "dinner" },
  ];

  const paxOptions = Array.from({ length: 101 }, (_, i) => 50 + i + " pax");

  useEffect(() => {
    calculateSubtotal();
  }, [selectedItems, selectedPax]);

  const calculateSubtotal = () => {
    const baseAmount = 17500;
    const pax = parseInt(selectedPax.split(" ")[0]) || 50; // Extract the number of pax from the selected value

    // Calculate the total based on the number of pax
    const total = baseAmount + (pax - 50) * 350;

    setSubtotal(total);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = {};

    if (!selectedDate) errors.selectedDate = "Date is required";
    if (!selectedTimeSlot) errors.selectedTimeSlot = "Time slot is required";
    if (!selectedPax) errors.selectedPax = "Number of pax is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      console.log("Proceeding to payment");
    }
  };

  const handleReturn = () => {
    navigate("/reservation", { state: { selectedItems } });
  };

  const handleCancelReservation = () => {
    setShowCancellationWarning(true);
  };

  const confirmCancelReservation = () => {
    navigate("/", { replace: true });
  };

  const cancelCancelReservation = () => {
    setShowCancellationWarning(false);
  };

  const handleFoodItemRemove = (itemToRemove) => {
    setSelectedItems((prevItems) =>
      prevItems.filter((item) => item !== itemToRemove)
    );
  };

  return (
    <form className="place-order" onSubmit={handleSubmit}>
      <div className="place-order-left">
        <img onClick={handleReturn} src={assets.back_icon} alt="Back" />
        <p className="title">Reservation Information</p>
        <div className="multi-fields">
          <input type="text" placeholder="First Name" required />
          <input type="text" placeholder="Last Name" required />
        </div>
        <input type="text" placeholder="Phone no." required />
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
              <input type="text" placeholder="Street" />
              <input type="text" placeholder="City" />
              <input type="text" placeholder="Province" />
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
              placeholder="Leave your note here ..."
            ></textarea>
          </div>
        </div>
      </div>
      <div className="place-order-right">
        <div className="order-total">
          <p className="title">Order Summary</p>
          <div className="selected-items-list">
            <p className="selected-items">Selected Items:</p>
            <ul>
              {selectedItems.length > 0 ? (
                selectedItems.map((item, index) => (
                  <li key={index}>
                    <span className="food-name">{item.name}</span>
                    <span className="dots"></span>
                    <button
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
          </div>
          <div className="total-section">
            <p className="total">Total: PHP {subtotal.toFixed(2)}</p>
          </div>
          <div className="summary-button">
            <button className="cancel-button" onClick={handleCancelReservation}>
              CANCEL RESERVATION
            </button>
            <button className="payment-button" type="submit">
              PROCEED TO PAYMENT
            </button>
          </div>
          {showCancellationWarning && (
            <React.Fragment>
              <div className="cancellation-warning">
                <p>Are you sure you want to cancel the reservation?</p>
                <div>
                  <button
                    className="yes-button"
                    onClick={confirmCancelReservation}
                  >
                    Yes, Cancel
                  </button>
                  <button
                    className="no-button"
                    onClick={cancelCancelReservation}
                  >
                    No, Keep Reservation
                  </button>
                </div>
              </div>
              <div className="cancellation-warning-overlay"></div>
            </React.Fragment>
          )}
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
