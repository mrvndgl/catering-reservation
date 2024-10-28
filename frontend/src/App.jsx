import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Reservation from "./components/Reservation/Reservation";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";

const App = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="app">
      {isHomePage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/order" element={<PlaceOrder />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
