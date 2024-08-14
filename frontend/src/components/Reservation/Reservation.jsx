import React, { useState, useEffect } from 'react';
import './Reservation.css';
import { assets } from '../../assets/assets'; 
import { food_list } from '../../assets/assets'; // Import the food_list
import { useNavigate } from 'react-router-dom'

const Reservation = ({ setShowReservation }) => {
    const [currState, setCurrState] = useState("Select Items");
    const [fadeIn, setFadeIn] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        setFadeIn(true);
    }, []);

    // Group food items by category
    const menuItems = food_list.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {});

    const [selectedItems, setSelectedItems] = useState(
        Object.fromEntries(Object.entries(menuItems).map(([category, items]) => [category, new Array(items.length).fill(false)]))
    );

    const handleCheckboxChange = (category, index) => {
        setSelectedItems(prevState => {
            const newState = {
                ...prevState,
                [category]: prevState[category].map((item, i) => i === index ? !item : item)
            };
            
            // Calculate new total price
            let newTotalPrice = 0;
            let selectedItemsList = [];
            Object.entries(newState).forEach(([cat, items]) => {
                items.forEach((isSelected, idx) => {
                    if (isSelected) {
                        const item = menuItems[cat][idx];
                        newTotalPrice += item.price;
                        selectedItemsList.push({
                            name: item.name,
                            price: item.price,
                            category: cat
                        });
                    }
                });
            });
            setTotalPrice(newTotalPrice);
            
            return newState;
        });
    };

    const handleClose = () => {
        setFadeIn(false);
        setTimeout(() => setShowReservation(false), 300);
    };

    return (
        <div className={`reservation ${fadeIn ? 'fade-in' : ''}`}>
            <div className="reservation-container">
                <div className="reservation-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={handleClose} src={assets.cross_icon} alt="Close" />
                </div>
                
                {/* Note Section */}
                <div className="reservation-note">
                    <p>Note : (350 per head)</p>
                    <p><strong>50 pax minimum (complete set-up)</strong></p>
                    <p><strong>Inclusions:</strong></p>
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
                                                checked={selectedItems[category][index]}
                                                onChange={() => handleCheckboxChange(category, index)}
                                            />
                                            <span className="food-name">{item.name}</span>
                                            <span className="food-price">₱  {item.price}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ))}
                </div>
                <div className="checkout">
                    <p>Total Price: ₱ {totalPrice}</p>
                    <button onClick={() => navigate('/order', { state: { totalPrice, selectedItems } })}>Continue</button>
                </div>
            </div>
        </div>
    );
}

export default Reservation;
