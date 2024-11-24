import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import ViewReservations from "./pages/ViewReservations/ViewReservations";
import Transactions from "./pages/Transactions/Transactions";
import Feedbacks from "./pages/Feedbacks/Feedbacks";
import Accounts from "./pages/Accounts/Accounts";
import Add from "./pages/Add/Add";
import ListItems from "./pages/ListItems/ListItems";
import Login from "./pages/Login/LogIn";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(true);
  const [profilePhoto, setProfilePhoto] = React.useState(null);

  const handleLogin = () => {
    setIsAuthenticated(true);
    toast.success("Login successful!");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    toast.info("Logged out successfully!");
  };

  const handleEditProfile = () => {
    // Handle edit profile logic
    toast.info("Editing profile...");
  };

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        containerId="main-toast-container"
      />

      <div>
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
          <div className="main-content">
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

              {/* Protected Routes */}
              <Route
                path="/reservations"
                element={
                  isAuthenticated ? (
                    <ViewReservations />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              <Route
                path="/transactions"
                element={
                  isAuthenticated ? <Transactions /> : <Navigate to="/login" />
                }
              />

              <Route
                path="/feedbacks"
                element={
                  isAuthenticated ? <Feedbacks /> : <Navigate to="/login" />
                }
              />

              <Route
                path="/accounts"
                element={
                  isAuthenticated ? <Accounts /> : <Navigate to="/login" />
                }
              />

              <Route
                path="/add"
                element={isAuthenticated ? <Add /> : <Navigate to="/login" />}
              />

              <Route
                path="/list-items"
                element={
                  isAuthenticated ? <ListItems /> : <Navigate to="/login" />
                }
              />

              {/* Catch all route - redirect to reservations if authenticated, login if not */}
              <Route
                path="*"
                element={
                  isAuthenticated ? (
                    <Navigate to="/reservations" />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
            </Routes>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
