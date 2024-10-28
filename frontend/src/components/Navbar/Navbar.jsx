import React, { useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menu, setMenu] = useState("Menu");

  return (
    <div className="navbar">
      <img className="logo" src={assets.logo} alt="" />
      <ul className="navbar-menu">
        <li>
          <a
            href="#header"
            onClick={() => setMenu("Home")}
            className={menu === "Home" ? "active" : ""}
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="#explore-menu"
            onClick={() => setMenu("Menu")}
            className={menu === "Menu" ? "active" : ""}
          >
            Menu
          </a>
        </li>
        <li>
          <a
            href="#footer"
            onClick={() => setMenu("Contact-us")}
            className={menu === "Contact-us" ? "active" : ""}
          >
            Contact us
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
