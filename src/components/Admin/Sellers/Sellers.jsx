import React, { useState, useEffect } from "react";
import "./Sellers.css";
import Sidebar from "../../Navbar/Sidebar";
import Button from "../../Buttons/Buttons";
import { useParams } from "react-router-dom";
import Topbar from "../../Navbar/Topbar";
import API_BASE_URL from "../../Config/api";

const ClientForm = () => {
  const { id } = useParams();

  /* ================= SIDEBAR STATE ================= */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [propertyTypes, setPropertyTypes] = useState([]);

  const [client, setClient] = useState({
    name: "",
    property_name: "",
    property_type: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    district: "",
    seller_type: "",
    notes: ""
  });

  const change = (e) =>
    setClient({ ...client, [e.target.name]: e.target.value });

  const loadPropertyTypes = async () => {
    try {
const res = await fetch(`${API_BASE_URL}/api/property-types`);
      const data = await res.json();
      setPropertyTypes(data);
    } catch (err) {
      console.error("❌ Error loading property types:", err);
    }
  };

  const fetchSeller = async () => {
    try {
const res = await fetch(`${API_BASE_URL}/api/seller/${id}`);
      const data = await res.json();
      setClient(data);
    } catch (err) {
      console.error("❌ Error loading seller:", err);
    }
  };

  useEffect(() => {
    loadPropertyTypes();
    if (id) fetchSeller();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();

    const url = id
  ? `${API_BASE_URL}/api/update-seller/${id}`
  : `${API_BASE_URL}/api/add-seller`;


    const method = id ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(client),
      });

      const result = await res.json();
      alert(result.message);
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Failed to process request.");
    }
  };

  return (
    <div className="layout-wrapper">
      <Sidebar isOpen={sidebarOpen} />
      <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="seller-content">
        <div className="sellers-form-container">

          <h2 className="sellers-title">
            {id ? "Edit Client / Seller" : "Add Client / Seller"}
          </h2>

          <form className="sellers-form" onSubmit={submit}>

            <label>Client Name</label>
            <input
              className="sellers-input"
              name="name"
              value={client.name}
              onChange={change}
              required
            />

            <label>Property Name</label>
            <input
              className="sellers-input"
              name="property_name"
              value={client.property_name}
              onChange={change}
            />

            <label>Property Type</label>
            <select
              className="sellers-select"
              name="property_type"
              value={client.property_type}
              onChange={change}
            >
              <option value="">Select Property Type</option>
              {propertyTypes.map((pt) => (
                <option key={pt.type_id} value={pt.type_name}>
                  {pt.type_name}
                </option>
              ))}
            </select>

            <label>Phone</label>
            <input
              className="sellers-input"
              name="phone"
              value={client.phone}
              onChange={change}
              required
            />

            <label>Email</label>
            <input
              className="sellers-input"
              type="email"
              name="email"
              // value={client.email || ""}
              value={client.email && client.email !== "NULL" ? client.email : ""}
              onChange={change}
            />

            <label>Address</label>
            <input
              className="sellers-input"
              name="address"
              value={client.address || ""}
              onChange={change}
            />

            <label>City</label>
            <input
              className="sellers-input"
              name="city"
              value={client.city || ""}
              onChange={change}
            />

            <label>District</label>
            <input
              className="sellers-input"
              name="district"
              value={client.district || ""}
              onChange={change}
            />

            <label>Seller Type</label>
            <select
              className="sellers-select"
              name="seller_type"
              value={client.seller_type}
              onChange={change}
            >
              <option value="">Select Type</option>
              <option>Owner</option>
              <option>Builder</option>
              <option>Agent</option>
            </select>

            <label>Notes</label>
            <textarea
              className="sellers-textarea"
              name="notes"
              value={client.notes || ""}
              onChange={change}
            />

            <Button
              label={id ? "Update Client" : "Save Client"}
              type="submit"
            />
          </form>

        </div>
      </div>
    </div>
  );
};

export default ClientForm;
