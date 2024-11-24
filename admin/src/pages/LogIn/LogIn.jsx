import React, { useState } from "react";
import { toast } from "react-toastify";
import "./LogIn.css";

const LogIn = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    try {
      // Use toast.promise to handle the async login operation
      await toast.promise(onLogin(username, password), {
        pending: {
          render() {
            return "Logging in...";
          },
          icon: "🔄",
        },
        success: {
          render() {
            return "Login successful!";
          },
          icon: "✅",
        },
        error: {
          render({ data }) {
            // Set the error message for the Alert component
            setError(data?.message || "Login failed");
            return data?.message || "Login failed";
          },
          icon: "❌",
        },
      });
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
      {error && (
        <div className="error-container">
          <Alert variant="destructive">
            <span>{error}</span>
          </Alert>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>
        <div className="input-field">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
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
