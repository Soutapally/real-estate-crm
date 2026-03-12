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
    property_types: [],
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

  /* ======================
     LOAD SELLERS
  ====================== */

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/sellers`)
      .then(res => res.json())
      .then(data => setSellers(data));
  }, []);

  /* ======================
     LOAD PROPERTY TYPES
  ====================== */

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/property-types`)
      .then(res => res.json())
      .then(data => setPropertyTypes(data));
  }, []);

  /* ======================
     LOAD PROPERTY FOR EDIT
  ====================== */

  useEffect(() => {

    if (!id) return;

    fetch(`${API_BASE_URL}/api/property/${id}`)
      .then(res => res.json())
      .then(data => {

        setForm({
          seller_id: data.seller_id || "",
          property_name: data.property_name || "",
          property_types: (data.property_types || []).map(Number),
          price: data.price || "",
          area_value: data.area_value || "",
          area_unit: data.area_unit || "sqft",
          facing_direction: data.facing_direction || "",
          mandal: data.mandal || "",
          address: data.address || "",
          district: data.district || "",
          availability: data.availability || "",
          description: data.description || ""
        });

      });

  }, [id]);

  /* ======================
     INPUT HANDLER
  ====================== */

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  /* ======================
     PROPERTY TYPE TOGGLE
  ====================== */

  const togglePropertyType = (typeId) => {

    const idNum = Number(typeId);

    if (form.property_types.includes(idNum)) {

      setForm({
        ...form,
        property_types: form.property_types.filter(id => id !== idNum)
      });

    } else {

      setForm({
        ...form,
        property_types: [...form.property_types, idNum]
      });

    }

  };

  /* ======================
     SUBMIT
  ====================== */

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!form.seller_id || !form.property_name) {
      alert("Seller and Property Name are required");
      return;
    }

    const url = id
      ? `${API_BASE_URL}/api/update-property/${id}`
      : `${API_BASE_URL}/api/add-property`;

    const method = id ? "PUT" : "POST";

    const payload = {

      seller_id: Number(form.seller_id),

      property_name: form.property_name,

      property_types: form.property_types.map(Number),

      price: form.price === "" ? null : Number(form.price),

      area_value: form.area_value || null,

      area_unit: form.area_unit || null,

      facing_direction: form.facing_direction || null,

      mandal: form.mandal || null,

      address: form.address || null,

      district: form.district || null,

      availability: form.availability || null,

      description: form.description || null

    };

    try {

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Something went wrong");
        return;
      }

      alert(result.message);

      navigate("/properties");

    } catch (err) {

      console.error(err);
      alert("Server error");

    }

  };

  /* ======================
     UI
  ====================== */

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

            {/* Seller */}

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

            {/* Property Name */}

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

            {/* PROPERTY TYPES MULTI SELECT */}

            <div className="form-row">
              <label>Property Types</label>

              <div className="multi-select">

                <div className="selected-types">

                  {form.property_types.map((id) => {

                    const type = propertyTypes.find(
                      t => Number(t.type_id) === Number(id)
                    );

                    return (
                      <span key={id} className="type-chip">

                        {type?.type_name}

                        <button
                          type="button"
                          onClick={() => togglePropertyType(id)}
                        >
                          ×
                        </button>

                      </span>
                    );

                  })}

                </div>

                <div className="dropdown-types">

                  {propertyTypes.map(pt => (

                    <label key={pt.type_id} className="type-option">

                      <input
                        type="checkbox"
                        checked={form.property_types.includes(Number(pt.type_id))}
                        onChange={() => togglePropertyType(pt.type_id)}
                      />

                      {pt.type_name}

                    </label>

                  ))}

                </div>

              </div>

            </div>

            {/* Price */}

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

            {/* Area */}

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

            {/* Facing */}

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

            {/* Mandal */}

            <div className="form-row">
              <label>Mandal</label>

              <input
                className="properties-input"
                name="mandal"
                value={form.mandal}
                onChange={handleChange}
              />
            </div>

            {/* Address */}

            <div className="form-row">
              <label>Address</label>

              <input
                className="properties-input"
                name="address"
                value={form.address}
                onChange={handleChange}
              />
            </div>

            {/* District */}

            <div className="form-row">
              <label>District</label>

              <input
                className="properties-input"
                name="district"
                value={form.district}
                onChange={handleChange}
              />
            </div>

            {/* Availability */}

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

            {/* Description */}

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