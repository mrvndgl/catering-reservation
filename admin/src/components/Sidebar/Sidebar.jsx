import React, { useState } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to="/reservations" className="sidebar-option">
          <img src={assets.reservation_icon} alt="" />
          <p>View Reservations</p>
        </NavLink>
        <NavLink to="/transactions" className="sidebar-option">
          <img src={assets.transactions_icon} alt="" />
          <p>View Transactions</p>
        </NavLink>
        <NavLink to="/add" className="sidebar-option">
          <img src={assets.add_icon} alt="" />
          <p>Add Items</p>
        </NavLink>
        <NavLink to="/list-items" className="sidebar-option">
          <img src={assets.list_icon} alt="" />
          <p>List Items</p>
        </NavLink>
        <NavLink to="/view-feedbacks" className="sidebar-option">
          <img src={assets.feedback_icon} alt="" />
          <p>View Feedbacks</p>
        </NavLink>
        <NavLink to="/accounts" className="sidebar-option">
          <img src={assets.account_icon} alt="" />
          <p>View Accounts</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
