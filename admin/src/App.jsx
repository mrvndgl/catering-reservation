import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Accounts from "./pages/Accounts/Accounts";
import Add from "./pages/Add/Add";
import ListItems from "./pages/ListItems/ListItems";
import Login from "./pages/LogIn/LogIn";
import Alert from "./components/Alert/Alert";
import ViewReservations from "./pages/ViewReservations/ViewReservations";
import Transactions from "./pages/Transactions/Transactions";
import Feedbacks from "./pages/Feedbacks/Feedbacks";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const navigate = useNavigate();

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      navigate("/reservations");
    }
    setIsLoading(false);
  }, [navigate]);

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch("http://localhost:4000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setIsAuthenticated(true);
        setError("");
        navigate("/reservations");
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setError("");
    setProfilePhoto(null);
    navigate("/login");
  };

  const handleEditProfile = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfilePhoto(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {error && <Alert variant="destructive">{error}</Alert>}
      {isAuthenticated && (
        <Navbar
          onLogout={handleLogout}
          onEditProfile={handleEditProfile}
          profilePhoto={profilePhoto}
        />
      )}
      <hr />
      <div className="app-content">
        {isAuthenticated && <Sidebar />}

        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/reservations" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />

          <Route
            path="/reservations"
            element={
              isAuthenticated ? (
                <ViewReservations />
              ) : (
                <Navigate to="/reservations" replace />
              )
            }
          />

          <Route
            path="/transactions"
            element={
              isAuthenticated ? (
                <Transactions />
              ) : (
                <Navigate to="/transactions" replace />
              )
            }
          />

          <Route
            path="/feedbacks"
            element={
              isAuthenticated ? (
                <Feedbacks />
              ) : (
                <Navigate to="/feedbacks" replace />
              )
            }
          />

          <Route
            path="/accounts"
            element={
              isAuthenticated ? (
                <Accounts />
              ) : (
                <Navigate to="/accounts" replace />
              )
            }
          />

          <Route
            path="/add"
            element={isAuthenticated ? <Add /> : <Navigate to="/add" replace />}
          />

          <Route
            path="/list-items"
            element={
              isAuthenticated ? <ListItems /> : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
