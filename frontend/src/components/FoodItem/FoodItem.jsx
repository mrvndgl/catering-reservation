import React, { useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';

const FoodItem = ({ id, name, price, description, image }) => {
  
  return (
    <div className='food-item'>
      <div className="food-item-img-container">
        <img className='food-item-image' src={image} alt={name} />
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">
          <span className='peso-sign'>₱</span> {price}
        </p>
      </div>
    </div>
  );
};

export default FoodItem;