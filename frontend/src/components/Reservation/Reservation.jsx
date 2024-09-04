import React, { useState, useEffect } from "react";
import "./Reservation.css";
import { assets, food_list } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const Reservation = ({ setShowReservation }) => {
  const [currState, setCurrState] = useState("Select Items");
  const [fadeIn, setFadeIn] = useState(false);
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
    for (const items of Object.values(selectedItems)) {
      if (!items.some((isSelected) => isSelected)) {
        alert(`Please select at least one item from each table.`);
        return false;
      }
    }
    return true;
  };

  const handleContinue = () => {
    if (validateSelection()) {
      const selectedItemsList = getSelectedItemsList();
      if (selectedItemsList.length > 0) {
        navigate("/order", {
          state: {
            selectedItems: selectedItemsList,
          },
        });
      }
    }
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

  return (
    <div className={`reservation ${fadeIn ? "fade-in" : ""}`}>
      <div className="reservation-container">
        <div className="reservation-popup-title">
          <h2>{currState}</h2>
          <img onClick={handleClose} src={assets.cross_icon} alt="Close" />
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
          <button onClick={handleContinue}>Continue</button>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
