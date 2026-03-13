// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import "./Customers.css";
// import Sidebar from "../../Navbar/Sidebar";
// import Button from "../../Buttons/Buttons";
// import Topbar from "../../Navbar/Topbar";
// import API_BASE_URL from "../../Config/api";

// const CustomerForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   /* =========================
//      SIDEBAR STATE (REQUIRED)
//   ========================= */
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const [propertyTypes, setPropertyTypes] = useState([]);

//   const [data, setData] = useState({
//     name: "",
//     phone: "",
//     phone_alt: "",
//     email: "",
//     budget_from_value: "",
//     budget_from_unit: "Lakhs",
//     budget_to_value: "",
//     budget_to_unit: "Lakhs",
//     location: "",
//     property_type: "",
//     requirement: "",
//     status: "",
//   });

//   const update = (e) => {
//     setData({ ...data, [e.target.name]: e.target.value });
//   };

//   useEffect(() => {
//     loadPropertyTypes();
//     if (id) loadCustomer();
//   }, [id]);
  
// const loadPropertyTypes = async () => {
//   const res = await fetch(`${API_BASE_URL}/api/property-types`);
//   const types = await res.json();
//   setPropertyTypes(types);
// };


//   const loadCustomer = async () => {
//     const res = await fetch(`${API_BASE_URL}/api/customer/${id}`);
//     const customer = await res.json();

//     const [fromValue, fromUnit] = customer.budget_min?.split(" ") || ["", "Lakhs"];
//     const [toValue, toUnit] = customer.budget_max?.split(" ") || ["", "Lakhs"];

//     setData({
//       name: customer.name,
//       phone: customer.phone,
//       phone_alt: customer.phone_alt || "",
//       email: customer.email,
//       budget_from_value: fromValue,
//       budget_from_unit: fromUnit,
//       budget_to_value: toValue,
//       budget_to_unit: toUnit,
//       location: customer.preferred_location,
//       property_type: customer.property_type,
//       requirement: customer.requirement_details,
//       status: customer.lead_status,
//     });
//   };

//   const submit = async (e) => {
//     e.preventDefault();

//     // const payload = {
//     //   name: data.name,
//     //   phone: data.phone,
//     //   phone_alt: data.phone_alt,
//     //   email: data.email,
//     //   budget_from: `${data.budget_from_value} ${data.budget_from_unit}`,
//     //   budget_to: `${data.budget_to_value} ${data.budget_to_unit}`,
//     //   location: data.location,
//     //   property_type: data.property_type,
//     //   requirement: data.requirement,
//     //   status: data.status,
//     // };
//     const payload = {
//   name: data.name,
//   phone: data.phone,

//   phone_alt: data.phone_alt?.trim() || null,
//   email: data.email?.trim() || null,

//   // ✅ SAFE BUDGET BUILDING
//   budget_from:
//     data.budget_from_value && data.budget_from_unit
//       ? `${data.budget_from_value} ${data.budget_from_unit}`
//       : null,

//   budget_to:
//     data.budget_to_value && data.budget_to_unit
//       ? `${data.budget_to_value} ${data.budget_to_unit}`
//       : null,

//   location: data.location?.trim() || null,
//   property_type: data.property_type || null,
//   requirement: data.requirement?.trim() || null,
//   status: data.status || null,
// };


//     const url = id
//       ? `${API_BASE_URL}/api/update-customer/${id}`
//       : `${API_BASE_URL}/api/add-customer`;

//     const res = await fetch(url, {
//       method: id ? "PUT" : "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     const result = await res.json();
//     alert(result.message);
//     navigate("/customers");
//   };

//   return (
//     <div className="layout-wrapper">
//       {/* ✅ PASS STATE */}
//       <Sidebar isOpen={sidebarOpen} />

//       {/* ✅ PASS TOGGLE */}
//       <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

//       <div className="form-wrapper">
//         <div className="form-card">
//           <h2 className="customers-title">
//             {id ? "Edit Customer" : "Add Customer / Buyer Lead"}
//           </h2>

//           <form className="form-column" onSubmit={submit}>
//             <input name="name" value={data.name} placeholder="Customer Name" onChange={update} required />
//             <input name="phone" value={data.phone} placeholder="Phone Number" onChange={update} required />
//             <input name="phone_alt" value={data.phone_alt} placeholder="Alternate Phone Number" onChange={update} />
//             <input name="email" value={data.email} placeholder="Email ID" type="email" onChange={update} />

//             <div className="budget-row">
//               <input type="number" name="budget_from_value" placeholder="Budget From" value={data.budget_from_value} onChange={update} />
//               <select name="budget_from_unit" value={data.budget_from_unit} onChange={update}>
//                 <option>Lakhs</option>
//                 <option>Crores</option>
//               </select>
//             </div>

//             <div className="budget-row">
//               <input type="number" name="budget_to_value" placeholder="Budget To" value={data.budget_to_value} onChange={update} />
//               <select name="budget_to_unit" value={data.budget_to_unit} onChange={update}>
//                 <option>Lakhs</option>
//                 <option>Crores</option>
//               </select>
//             </div>

//             <input name="location" value={data.location} placeholder="Preferred Location" onChange={update} />

//             <select name="property_type" value={data.property_type} onChange={update}>
//               <option value="">Interested Property Type</option>
//               {propertyTypes.map((pt) => (
//                 <option key={pt.type_id} value={pt.type_name}>
//                   {pt.type_name}
//                 </option>
//               ))}
//             </select>

//             <textarea name="requirement" value={data.requirement} placeholder="Requirement Details" onChange={update} />

//             <select name="status" value={data.status} onChange={update}>
//               <option value="">Lead Status</option>
//               <option>New</option>
//               <option>Follow-up</option>
//               <option>Site Visit</option>
//               <option>Hot</option>
//               <option>Closed</option>
//               <option>Lost</option>
//             </select>

//             <Button label={id ? "Update Customer" : "Save Customer"} type="submit" />
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomerForm;
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
    property_types: [],   // ⭐ MULTI SELECT ARRAY
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

  const [fromValue, fromUnit] =
    customer.budget_min?.split(" ") || ["", "Lakhs"];

  const [toValue, toUnit] =
    customer.budget_max?.split(" ") || ["", "Lakhs"];

  /* ⭐ convert saved property_types into array */

  let selectedTypes = [];

  if (customer.property_types) {

    if (Array.isArray(customer.property_types)) {
      selectedTypes = customer.property_types;
    } else {
      selectedTypes = customer.property_types.split(",").map(Number);
    }

  }

  setData({
    name: customer.name,
    phone: customer.phone,
    phone_alt: customer.phone_alt || "",
    email: customer.email || "",

    budget_from_value: fromValue,
    budget_from_unit: fromUnit,

    budget_to_value: toValue,
    budget_to_unit: toUnit,

    location: customer.preferred_location || "",

    property_types: selectedTypes,   // ⭐ FIXED

    requirement: customer.requirement_details || "",
    status: customer.lead_status || "",
  });

};

  /* ======================
     PROPERTY TYPE TOGGLE
  ====================== */

  const togglePropertyType = (typeId) => {

    if (data.property_types.includes(typeId)) {

      setData({
        ...data,
        property_types: data.property_types.filter(t => t !== typeId)
      });

    } else {

      setData({
        ...data,
        property_types: [...data.property_types, typeId]
      });

    }

  };

  const removeType = (typeId) => {

    setData({
      ...data,
      property_types: data.property_types.filter(t => t !== typeId)
    });

  };

  /* ======================
     SUBMIT
  ====================== */

  const submit = async (e) => {

    e.preventDefault();

    const payload = {

      name: data.name,
      phone: data.phone,

      phone_alt: data.phone_alt?.trim() || null,
      email: data.email?.trim() || null,

      budget_from:
        data.budget_from_value && data.budget_from_unit
          ? `${data.budget_from_value} ${data.budget_from_unit}`
          : null,

      budget_to:
        data.budget_to_value && data.budget_to_unit
          ? `${data.budget_to_value} ${data.budget_to_unit}`
          : null,

      location: data.location?.trim() || null,

      property_types: data.property_types,   // ⭐ ARRAY SENT

      requirement: data.requirement?.trim() || null,
      status: data.status || null,
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

      <Sidebar isOpen={sidebarOpen} />
      <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="form-wrapper">

        <div className="form-card">

          <h2 className="customers-title">
            {id ? "Edit Customer" : "Add Customer / Buyer Lead"}
          </h2>

          <form className="form-column" onSubmit={submit}>

            <input
              name="name"
              value={data.name}
              placeholder="Customer Name"
              onChange={update}
              required
            />

            <input
              name="phone"
              value={data.phone}
              placeholder="Phone Number"
              onChange={update}
              required
            />

            <input
              name="phone_alt"
              value={data.phone_alt}
              placeholder="Alternate Phone Number"
              onChange={update}
            />

            <input
              name="email"
              value={data.email}
              placeholder="Email ID"
              type="email"
              onChange={update}
            />

            {/* Budget */}

            <div className="budget-row">
              <input
                type="number"
                name="budget_from_value"
                placeholder="Budget From"
                value={data.budget_from_value}
                onChange={update}
              />

              <select
                name="budget_from_unit"
                value={data.budget_from_unit}
                onChange={update}
              >
                <option>Lakhs</option>
                <option>Crores</option>
              </select>
            </div>

            <div className="budget-row">
              <input
                type="number"
                name="budget_to_value"
                placeholder="Budget To"
                value={data.budget_to_value}
                onChange={update}
              />

              <select
                name="budget_to_unit"
                value={data.budget_to_unit}
                onChange={update}
              >
                <option>Lakhs</option>
                <option>Crores</option>
              </select>
            </div>

            <input
              name="location"
              value={data.location}
              placeholder="Preferred Location"
              onChange={update}
            />

            {/* ⭐ MULTI PROPERTY TYPE */}

          <div className="multi-select">

  {/* SELECTED PROPERTY TYPES */}

{/* ===============================
               PROPERTY TYPE MULTI DROPDOWN
            =============================== */}

            <div className="multi-select-container">

              <div
                className="multi-select-input"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >

                {selectedPropertyNames || "Select Property Types"}

                <span className="dropdown-arrow">▾</span>

              </div>

              {dropdownOpen && (

                <div className="multi-select-dropdown">

                  {propertyTypes.map((pt) => (

                    <label key={pt.type_id} className="dropdown-option">

                      <input
                        type="checkbox"
                        checked={data.property_types.includes(pt.type_id)}
                        onChange={() => togglePropertyType(pt.type_id)}
                      />

                      <span>{pt.type_name}</span>

                    </label>

                  ))}

                </div>

              )}

            </div>


 

  {/* <div className="dropdown-types">

    {propertyTypes.map(pt => (

      <label key={pt.type_id} className="type-option">

        <input
          type="checkbox"
          checked={data.property_types.includes(pt.type_id)}
          onChange={() => togglePropertyType(pt.type_id)}
        />

        <span className="type-name">
          {pt.type_name}
        </span>

      </label>

    ))}

  </div> */}

</div>

            <textarea
              name="requirement"
              value={data.requirement}
              placeholder="Requirement Details"
              onChange={update}
            />

            <select
              name="status"
              value={data.status}
              onChange={update}
            >
              <option value="">Lead Status</option>
              <option>New</option>
              <option>Follow-up</option>
              <option>Site Visit</option>
              <option>Hot</option>
              <option>Closed</option>
              <option>Lost</option>
            </select>

            <Button
              label={id ? "Update Customer" : "Save Customer"}
              type="submit"
            />

          </form>

        </div>
      </div>
    </div>
  );
};

export default CustomerForm;