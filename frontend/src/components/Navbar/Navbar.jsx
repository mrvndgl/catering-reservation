// Navbar.jsx
import React, { useState, useEffect } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [menu, setMenu] = useState("Menu");
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuClick = (menuItem) => {
    setMenu(menuItem);
    setIsOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Hamburger Menu Button */}
        <button className="hamburger-menu" onClick={toggleMenu}>
          <span className={`hamburger-line ${isOpen ? "open" : ""}`}></span>
          <span className={`hamburger-line ${isOpen ? "open" : ""}`}></span>
          <span className={`hamburger-line ${isOpen ? "open" : ""}`}></span>
        </button>

        {/* Desktop and Mobile Menu */}
        <ul className={`navbar-menu ${isOpen ? "active" : ""}`}>
          <li>
            <a
              href="#explore-menu"
              onClick={() => handleMenuClick("Menu")}
              className={menu === "Menu" ? "active" : ""}
            >
              Menu
            </a>
          </li>
          <li>
            <a
              href="#footer"
              onClick={() => handleMenuClick("Contact-us")}
              className={menu === "Contact-us" ? "active" : ""}
            >
              Contact us
            </a>
          </li>
          <li>
            <a
              href="#notifications"
              onClick={() => handleMenuClick("Notifications")}
              className={menu === "Notifications" ? "active" : ""}
            >
              Notifications
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
