import React, { useState } from "react";
import Alert from "../../components/Alert/Alert"; // Update the path as necessary
import "./LogIn.css"; // Import the CSS file

const LogIn = ({ onLogin }) => {
  const [username, setUsername] = useState(""); // Changed from email to username
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onLogin(username, password); // Use username for login
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Login failed");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="login-container">
      {error && <Alert variant="destructive">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>
        <div className="input-field">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username" // Change to username
            required
            className="login-input"
          />
        </div>
        <div className="input-field password-container">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="password-input"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="show-password-btn"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <button type="submit" className="submit-btn">
          Login
        </button>
      </form>
    </div>
  );
};

export default LogIn;
