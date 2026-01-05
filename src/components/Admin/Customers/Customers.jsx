import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Customers.css";
import Sidebar from "../../Navbar/Sidebar";
import Button from "../../Buttons/Buttons";
import Topbar from "../../Navbar/Topbar";
import API_BASE_URL from "../../Config/api";

const CustomerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  /* =========================
     SIDEBAR STATE (REQUIRED)
  ========================= */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [propertyTypes, setPropertyTypes] = useState([]);

  const [data, setData] = useState({
    name: "",
    phone: "",
    phone_alt: "",
    email: "",
    budget_from_value: "",
    budget_from_unit: "Lakhs",
    budget_to_value: "",
    budget_to_unit: "Lakhs",
    location: "",
    property_type: "",
    requirement: "",
    status: "",
  });

  const update = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    loadPropertyTypes();
    if (id) loadCustomer();
  }, [id]);
  
const loadPropertyTypes = async () => {
  const res = await fetch(`${API_BASE_URL}/api/property-types`);
  const types = await res.json();
  setPropertyTypes(types);
};


  const loadCustomer = async () => {
    const res = await fetch(`${API_BASE_URL}/api/customer/${id}`);
    const customer = await res.json();

    const [fromValue, fromUnit] = customer.budget_min?.split(" ") || ["", "Lakhs"];
    const [toValue, toUnit] = customer.budget_max?.split(" ") || ["", "Lakhs"];

    setData({
      name: customer.name,
      phone: customer.phone,
      phone_alt: customer.phone_alt || "",
      email: customer.email,
      budget_from_value: fromValue,
      budget_from_unit: fromUnit,
      budget_to_value: toValue,
      budget_to_unit: toUnit,
      location: customer.preferred_location,
      property_type: customer.property_type,
      requirement: customer.requirement_details,
      status: customer.lead_status,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      name: data.name,
      phone: data.phone,
      phone_alt: data.phone_alt,
      email: data.email,
      budget_from: `${data.budget_from_value} ${data.budget_from_unit}`,
      budget_to: `${data.budget_to_value} ${data.budget_to_unit}`,
      location: data.location,
      property_type: data.property_type,
      requirement: data.requirement,
      status: data.status,
    };

    const url = id
      ? `${API_BASE_URL}/api/update-customer/${id}`
      : `${API_BASE_URL}/api/add-customer`;

    const res = await fetch(url, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    alert(result.message);
    navigate("/customers");
  };

  return (
    <div className="layout-wrapper">
      {/* ✅ PASS STATE */}
      <Sidebar isOpen={sidebarOpen} />

      {/* ✅ PASS TOGGLE */}
      <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="form-wrapper">
        <div className="form-card">
          <h2 className="customers-title">
            {id ? "Edit Customer" : "Add Customer / Buyer Lead"}
          </h2>

          <form className="form-column" onSubmit={submit}>
            <input name="name" value={data.name} placeholder="Customer Name" onChange={update} required />
            <input name="phone" value={data.phone} placeholder="Phone Number" onChange={update} required />
            <input name="phone_alt" value={data.phone_alt} placeholder="Alternate Phone Number" onChange={update} />
            <input name="email" value={data.email} placeholder="Email ID" type="email" onChange={update} />

            <div className="budget-row">
              <input type="number" name="budget_from_value" placeholder="Budget From" value={data.budget_from_value} onChange={update} />
              <select name="budget_from_unit" value={data.budget_from_unit} onChange={update}>
                <option>Lakhs</option>
                <option>Crores</option>
              </select>
            </div>

            <div className="budget-row">
              <input type="number" name="budget_to_value" placeholder="Budget To" value={data.budget_to_value} onChange={update} />
              <select name="budget_to_unit" value={data.budget_to_unit} onChange={update}>
                <option>Lakhs</option>
                <option>Crores</option>
              </select>
            </div>

            <input name="location" value={data.location} placeholder="Preferred Location" onChange={update} />

            <select name="property_type" value={data.property_type} onChange={update}>
              <option value="">Interested Property Type</option>
              {propertyTypes.map((pt) => (
                <option key={pt.type_id} value={pt.type_name}>
                  {pt.type_name}
                </option>
              ))}
            </select>

            <textarea name="requirement" value={data.requirement} placeholder="Requirement Details" onChange={update} />

            <select name="status" value={data.status} onChange={update}>
              <option value="">Lead Status</option>
              <option>New</option>
              <option>Follow-up</option>
              <option>Site Visit</option>
              <option>Hot</option>
              <option>Closed</option>
              <option>Lost</option>
            </select>

            <Button label={id ? "Update Customer" : "Save Customer"} type="submit" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;
