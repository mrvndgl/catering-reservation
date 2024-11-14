import React, { useState, useEffect } from "react";
import "./Reservation.css";
import { assets, food_list } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Reservation = ({ setShowReservation }) => {
  const [currState, setCurrState] = useState("Select Items");
  const [fadeIn, setFadeIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const menuItems = food_list.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const [selectedItems, setSelectedItems] = useState(() => {
    const initialState = {};
    Object.keys(menuItems).forEach((category) => {
      initialState[category] = new Array(menuItems[category].length).fill(
        false
      );
    });
    return initialState;
  });

  const validateSelection = () => {
    const errors = [];

    Object.entries(selectedItems).forEach(([category, items]) => {
      if (!items.some((isSelected) => isSelected)) {
        errors.push(`Please select at least one item from ${category}`);
      }
    });

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return false;
    }
    return true;
  };

  const getSelectedItemsList = () => {
    const list = [];
    Object.entries(selectedItems).forEach(([category, items]) => {
      items.forEach((isSelected, index) => {
        if (isSelected) {
          list.push({
            ...menuItems[category][index],
            category,
          });
        }
      });
    });
    return list;
  };

  const handleCheckboxChange = (category, index) => {
    setSelectedItems((prevState) => ({
      ...prevState,
      [category]: prevState[category].map((item, i) =>
        i === index ? !item : item
      ),
    }));
  };

  const handleClose = () => {
    setFadeIn(false);
    setTimeout(() => setShowReservation(false), 300);
  };

  const createReservation = async (reservationData) => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
    const response = await fetch(`${apiUrl}/api/reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservationData),
    });

    if (!response.ok) {
      throw new Error("Failed to create reservation");
    }

    return response.json();
  };

  const handleContinue = async () => {
    if (!validateSelection()) return;

    const selectedItemsList = getSelectedItemsList();
    if (selectedItemsList.length === 0) {
      toast.error("Please select items before proceeding.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Even if the API call fails, we'll proceed to the placeorder page
      try {
        await createReservation(selectedItemsList);
        toast.success("Reservation confirmed!");
      } catch (error) {
        console.error("Error creating reservation:", error);
        // Show warning but don't block navigation
        toast.warning(
          "Proceeding without saving reservation. Please save your order details."
        );
      }

      // Navigate to placeorder page after a short delay
      setTimeout(() => {
        navigate("/order", {
          state: {
            selectedItems: selectedItemsList,
          },
          replace: true,
        });
      }, 1000);
    } catch (navigationError) {
      console.error("Navigation error:", navigationError);
      toast.error("Error navigating to order page. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`reservation ${fadeIn ? "fade-in" : ""}`}>
      <ToastContainer position="top-center" limit={3} />
      <div className="reservation-container">
        <div className="reservation-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={handleClose}
            src={assets.cross_icon}
            alt="Close"
            className="cursor-pointer hover:opacity-80"
          />
        </div>
        <div className="reservation-note">
          <p>Note : (350 per head)</p>
          <p>
            <strong>50 pax minimum (complete set-up)</strong>
          </p>
          <p>
            <strong>Inclusions:</strong>
          </p>
          <ul>
            <li>Rice</li>
            <li>1 Choice of Beef</li>
            <li>1 Choice of Pork</li>
            <li>1 Choice of Chicken</li>
            <li>1 Choice of Seafood or Noodles or Vegetables</li>
            <li>1 Choice of Dessert</li>
            <li>1 Choice of Drinks</li>
          </ul>
        </div>
        <div className="reservation-tables">
          {Object.entries(menuItems).map(([category, items]) => (
            <table key={category}>
              <thead>
                <tr>
                  <th colSpan="2">{category}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems[category]?.[index] || false}
                        onChange={() => handleCheckboxChange(category, index)}
                        disabled={isSubmitting}
                      />
                      <span className="food-name">{item.name}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
        <div className="checkout">
          <button
            onClick={handleContinue}
            disabled={isSubmitting}
            className={isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
          >
            {isSubmitting ? "Processing..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
