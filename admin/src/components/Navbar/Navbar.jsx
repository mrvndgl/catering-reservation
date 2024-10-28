import React, { useState, useRef, useEffect } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";

const Navbar = ({ onLogout, onEditProfile, profilePhoto }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="navbar">
      <div className="profile-container" ref={dropdownRef}>
        <div
          className="profile-icon"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <img
            className="profile-photo"
            src={profilePhoto || assets.profile_icon}
            alt="Profile"
          />
        </div>
        {showDropdown && (
          <div className="dropdown-menu">
            <button onClick={onEditProfile}>Edit Photo</button>
            <button onClick={onLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
