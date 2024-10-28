import React from "react";
import "./Alert.css";

const Alert = ({ variant = "default", children }) => {
  const baseStyle = "px-4 py-3 rounded relative mb-4";
  const variantStyles = {
    default: "alert-default",
    destructive: "alert-destructive",
  };

  return (
    <div className={`${baseStyle} ${variantStyles[variant]}`} role="alert">
      {children}
    </div>
  );
};

export default Alert;
