import React from "react";
import { FaEdit } from "react-icons/fa";
import "./EditButton.css";

const EditButton = ({ onClick, label = "Edit", width = "auto" }) => {
  return (
    <button
      className="custom-edit-btn"
      onClick={onClick}
      style={{ width }}
    >
      <FaEdit className="btn-icon" />
      <span>{label}</span>
    </button>
  );
};

export default EditButton;
