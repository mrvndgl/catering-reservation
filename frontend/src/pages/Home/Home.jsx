import React, { useState, useEffect } from "react";
import "./Home.css";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../components/Header/Header";
import { ExploreMenu } from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import Reservation from "../../components/Reservation/Reservation";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showReservation, setShowReservation] = useState(false);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    // Check for referenceCode in location state
    if (location.state?.referenceCode && location.state?.showSuccessMessage) {
      const referenceCode = location.state.referenceCode;

      // Show success toast
      toast.success(
        <div className="reservation-success-toast">
          <h4>Reservation Created Successfully!</h4>
          <p>
            Reference Code: <strong>{referenceCode}</strong>
          </p>
          <p>
            Please save this code to check your reservation status in the
            notifications page.
          </p>
        </div>,
        {
          position: "top-center",
          autoClose: 8000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

      // Clear the state after showing the toast
      navigate("/", { replace: true });
    }
  }, [location.state, navigate]);

  return (
    <div className="home">
      <Header setShowReservation={setShowReservation} />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
      {showReservation && (
        <div className="reservation-overlay">
          <Reservation setShowReservation={setShowReservation} />
        </div>
      )}
    </div>
  );
};

export default Home;
