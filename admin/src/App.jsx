import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Accounts from "./pages/Accounts/Accounts";
import Add from "./pages/Add/Add";
import ListItems from "./pages/ListItems/ListItems";
import Reservations from "./pages/Reservations/Reservations";
import Login from "./pages/LogIn/LogIn";
import Alert from "./components/Alert/Alert";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const navigate = useNavigate();

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      // Optionally, verify the token with your backend here
    }
  }, []);

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
        setIsAuthenticated(true);
        setError("");
        localStorage.setItem("token", data.token);
        navigate("/reservations");
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setError("");
    setProfilePhoto(null); // Clear the profile photo
    localStorage.removeItem("token");
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
          // TODO: Implement server-side upload
          // uploadProfilePhoto(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  // TODO: Implement this function to upload the photo to your server
  // const uploadProfilePhoto = async (photoData) => {
  //   try {
  //     const response = await fetch('http://localhost:4000/api/users/profile-photo', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${localStorage.getItem('token')}`
  //       },
  //       body: JSON.stringify({ photo: photoData })
  //     });
  //     if (!response.ok) {
  //       throw new Error('Failed to upload photo');
  //     }
  //   } catch (error) {
  //     setError('Failed to upload profile photo');
  //   }
  // };

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
                <Navigate to="/reservations" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/reservations" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/reservations"
            element={
              isAuthenticated ? <Reservations /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/accounts"
            element={isAuthenticated ? <Accounts /> : <Navigate to="/login" />}
          />
          <Route
            path="/add"
            element={isAuthenticated ? <Add /> : <Navigate to="/login" />}
          />
          <Route
            path="/list-items"
            element={isAuthenticated ? <ListItems /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
