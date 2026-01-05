import React from "react";
import { FaTrash } from "react-icons/fa";
import "./DeleteButton.css";

const DeleteButton = ({
  onClick,
  label = "Delete",
  width = "auto",
  confirm = true
}) => {
  const handleClick = () => {
    if (!confirm || window.confirm("Are you sure you want to delete?")) {
      onClick();
    }
  };

  return (
    <button
      className="custom-delete-btn"
      onClick={handleClick}
      style={{ width }}
    >
      <FaTrash className="btn-icon" />
      <span>{label}</span>
    </button>
  );
};

export default DeleteButton;
