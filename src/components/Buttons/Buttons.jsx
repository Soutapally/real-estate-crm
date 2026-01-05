import React from "react";
import "./Buttons.css";

const Button = ({ label, onClick, type = "button", width = "100%" }) => {
  return (
    <button 
      className="main-btn" 
      type={type} 
      onClick={onClick}
      style={{ width }}
    >
      {label}
    </button>
  );
};

export default Button;
