import React, { useState } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink
          to="/reservations"
          className={({ isActive }) =>
            `sidebar-option ${isActive ? "active" : ""}`
          }
        >
          <img src={assets.reservation_icon} alt="" />
          <p>View Reservations</p>
        </NavLink>

        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            `sidebar-option ${isActive ? "active" : ""}`
          }
        >
          <img src={assets.transactions_icon} alt="" />
          <p>View Transactions</p>
        </NavLink>

        <NavLink
          to="/add"
          className={({ isActive }) =>
            `sidebar-option ${isActive ? "active" : ""}`
          }
        >
          <img src={assets.add_icon} alt="" />
          <p>Add Items</p>
        </NavLink>

        <NavLink
          to="/list-items"
          className={({ isActive }) =>
            `sidebar-option ${isActive ? "active" : ""}`
          }
        >
          <img src={assets.list_icon} alt="" />
          <p>List Items</p>
        </NavLink>

        <NavLink
          to="/feedbacks"
          className={({ isActive }) =>
            `sidebar-option ${isActive ? "active" : ""}`
          }
        >
          <img src={assets.feedback_icon} alt="" />
          <p>View Feedbacks</p>
        </NavLink>

        <NavLink
          to="/accounts"
          className={({ isActive }) =>
            `sidebar-option ${isActive ? "active" : ""}`
          }
        >
          <img src={assets.account_icon} alt="" />
          <p>View Accounts</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
