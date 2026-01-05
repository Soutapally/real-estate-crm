import React, { useState, useEffect } from "react";
import "./Properties.css";
import Sidebar from "../../Navbar/Sidebar";
import Button from "../../Buttons/Buttons";
import { useNavigate, useParams } from "react-router-dom";
import Topbar from "../../Navbar/Topbar";
import API_BASE_URL from "../../Config/api";

const PropertyForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [sellers, setSellers] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);

  const [form, setForm] = useState({
    seller_id: "",
    property_name: "",
    property_type: "",
    price: "",
    area_value: "",
    area_unit: "sqft",
    facing_direction: "",
    mandal: "",
    address: "",
    district: "",
    availability: "",
    description: ""
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/sellers`)
      .then(res => res.json())
      .then(data => setSellers(data));
  }, []);

  useEffect(() => {
   fetch(`${API_BASE_URL}/api/property-types`)
      .then(res => res.json())
      .then(data => setPropertyTypes(data));
  }, []);

  useEffect(() => {
    if (id) {
     fetch(`${API_BASE_URL}/api/property/${id}`)
        .then(res => res.json())
        .then(data => setForm(data));
    }
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

   const url = id
  ? `${API_BASE_URL}/api/update-property/${id}`
  : `${API_BASE_URL}/api/add-property`;
    const method = id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const result = await res.json();
    alert(result.message);
    navigate("/properties");
  };

  return (
    <div className="properties-layout">
      <Sidebar />
<Topbar />
      <div className="properties-form-wrapper">
        <div className="properties-form-card">

          <h2 className="properties-title">
            {id ? "Edit Property" : "Add Property"}
          </h2>

          <form className="properties-form-column" onSubmit={handleSubmit}>

            <div className="form-row">
              <label>Select Seller</label>
              <select
                className="properties-select"
                name="seller_id"
                value={form.seller_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Seller</option>
                {sellers.map((s) => (
                  <option key={s.seller_id} value={s.seller_id}>
                    ({s.seller_id}) {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label>Property Name</label>
              <input
                className="properties-input"
                name="property_name"
                value={form.property_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <label>Property Type</label>
              <select
                className="properties-select"
                name="property_type"
                value={form.property_type}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                {propertyTypes.map((pt) => (
                  <option key={pt.type_id} value={pt.type_name}>
                    {pt.type_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label>Price (₹)</label>
              <input
                className="properties-input"
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
              />
            </div>

            {/* ✅ AREA + UNIT — FIXED */}
            <div className="form-row">
              <label>Area</label>
              <div className="property-area-row">
                <input
                  className="properties-input"
                  type="number"
                  name="area_value"
                  placeholder="Area"
                  value={form.area_value}
                  onChange={handleChange}
                />

                <select
                  className="properties-select property-area-unit"
                  name="area_unit"
                  value={form.area_unit}
                  onChange={handleChange}
                >
                  <option value="sqft">Sqft</option>
                  <option value="sqyds">Sq Yards</option>
                  <option value="acres">Acres</option>
                  <option value="guntas">Guntas</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <label>Facing</label>
              <select
                className="properties-select"
                name="facing_direction"
                value={form.facing_direction}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option>East</option>
                <option>West</option>
                <option>North</option>
                <option>South</option>
              </select>
            </div>

            <div className="form-row">
              <label>Mandal</label>
              <input
                className="properties-input"
                name="mandal"
                value={form.mandal}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <label>Address</label>
              <input
                className="properties-input"
                name="address"
                value={form.address}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <label>District</label>
              <input
                className="properties-input"
                name="district"
                value={form.district}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <label>Availability</label>
              <select
                className="properties-select"
                name="availability"
                value={form.availability}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option>Available</option>
                <option>Sold</option>
                <option>Booked</option>
                <option>Rented</option>
              </select>
            </div>

            <div className="form-row">
              <label>Description</label>
              <textarea
                className="properties-textarea"
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="properties-button-wrap">
              <Button
                label={id ? "Update Property" : "Save Property"}
                type="submit"
              />
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default PropertyForm;
