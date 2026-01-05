import React, { useState, useEffect } from "react";
import Sidebar from "../../Navbar/Sidebar";
import Topbar from "../../Navbar/Topbar";
import DeleteButton from "../../Buttons/DeleteButton";
import "./PropertyTypeForm.css";
import API_BASE_URL from "../../Config/api";

const PropertyTypeForm = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [typeName, setTypeName] = useState("");
  const [types, setTypes] = useState([]);

  /* LOAD PROPERTY TYPES */
  const loadTypes = async () => {
const res = await fetch(`${API_BASE_URL}/api/property-types`);
    const data = await res.json();
    setTypes(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadTypes();
  }, []);

  /* ADD PROPERTY TYPE */
  const submitType = async (e) => {
    e.preventDefault();

const res = await fetch(`${API_BASE_URL}/api/property-type`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type_name: typeName }),
    });

    const result = await res.json();
    alert(result.message);

    setTypeName("");
    loadTypes();
  };

  /* DELETE PROPERTY TYPE */
  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this property type?");
    if (!ok) return;

    const res = await fetch(
  `${API_BASE_URL}/api/property-type/${id}`,
  { method: "DELETE" }
);

    const result = await res.json();
    alert(result.message);
    loadTypes();
  };

  return (
    <div className="layout-wrapper">
      <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="pt-content">
        <div className="propertytype-container">
          <div className="propertytype-card">
            <h2 className="propertytype-title">Add Property Type</h2>

            <form className="propertytype-form" onSubmit={submitType}>
              <input
                className="propertytype-input"
                placeholder="Enter property type"
                value={typeName}
                onChange={(e) => setTypeName(e.target.value)}
                required
              />
              <button className="propertytype-btn" type="submit">
                Save Type
              </button>
            </form>

            <h3 className="propertytype-list-title">
              Available Property Types
            </h3>

            <ul className="propertytype-list">
              {types.map((t) => (
                <li className="propertytype-item" key={t.type_id}>
                  <span>{t.type_name}</span>
                  <DeleteButton
                    label=""
                    onClick={() => handleDelete(t.type_id)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyTypeForm;
