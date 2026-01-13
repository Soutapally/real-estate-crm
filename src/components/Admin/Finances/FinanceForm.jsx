import React, { useEffect, useState } from "react";
import Sidebar from "../../Navbar/Sidebar";
import Topbar from "../../Navbar/Topbar";
import { useNavigate, useParams } from "react-router-dom";
import "./FinanceForm.css";
import API_BASE_URL from "../../Config/api";

const INITIAL = {
  type: "Income",
  category: "",
  property_name: "",
  amount: "",
  record_date: "",
  notes: "",
  employee_id: "",
  employee_amount: ""
};

export default function FinanceForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(INITIAL);
  const [employees, setEmployees] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* LOAD EMPLOYEES */
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/employees`)
      .then(res => res.json())
      .then(setEmployees);
  }, []);

  /* LOAD DATA FOR EDIT */
  useEffect(() => {
    if (!isEdit) return;

    fetch(`${API_BASE_URL}/api/finance/${id}`)
      .then(res => res.json())
.then(data => {
  setForm({
    type: data.type || "Income",
    category: data.category || "",
    property_name: data.property_name || "",
    amount: data.amount || "",
    record_date: data.record_date
      ? data.record_date.split("T")[0]
      : "",
    notes: data.notes || "",
    employee_id: data.employee_id || "",
    employee_amount: data.employee_amount || ""
  });
});

  }, [id, isEdit, employees]);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("========== FORM SUBMIT START ==========");
console.log("Form state:", form);
  
  const isEmployeeCategory = form.category === "Salary" || form.category === "Incentives";
  console.log("isEmployeeCategory:", isEmployeeCategory);
  console.log("Category:", form.category);


  // Prepare the payload
  // const payload = {
  //   type: form.type,
  //   category: form.category,
    
  //   // Property name logic
  //   property_name: form.category === "Commission"
  //     ? form.property_name?.trim() || ""
  //     : isEmployeeCategory
  //       ? null
  //       : form.property_name?.trim() || null,
    
  //   // Amount logic
  //   amount: isEmployeeCategory
  //     ? Number(form.employee_amount)
  //     : Number(form.amount),
    
  //   // Date - convert to ISO format
  //   record_date: toISODate(form.record_date),
    
  //   // Notes
  //   notes: form.notes?.trim() || null,
    
  //   // Employee fields
  //   employee_id: isEmployeeCategory
  //     ? Number(form.employee_id)
  //     : null,
    
  //   employee_amount: isEmployeeCategory
  //     ? Number(form.employee_amount)
  //     : null
  // };
 const payload = {
    type: form.type,
    category: form.category,
    
    // Property name logic
    property_name: (() => {
      let value;
      if (form.category === "Commission") {
        value = form.property_name?.trim() || "";
        console.log("Property name (Commission):", value);
      } else if (isEmployeeCategory) {
        value = null;
        console.log("Property name (Employee category):", value);
      } else {
        value = form.property_name?.trim() || null;
        console.log("Property name (Other):", value);
      }
      return value;
    })(),
    
    // Amount logic
    amount: (() => {
      let value;
      if (isEmployeeCategory) {
        value = Number(form.employee_amount);
        console.log("Amount (from employee_amount):", value, "Raw:", form.employee_amount);
      } else {
        value = Number(form.amount);
        console.log("Amount (from amount):", value, "Raw:", form.amount);
      }
      return value;
    })(),
    
    // Date
    record_date: (() => {
      const date = toISODate(form.record_date);
      console.log("Record date:", date, "Raw:", form.record_date);
      return date;
    })(),
    
    // Notes
    notes: (() => {
      const notes = form.notes?.trim() || null;
      console.log("Notes:", notes);
      return notes;
    })(),
    
    // Employee fields
    employee_id: (() => {
      const id = isEmployeeCategory ? Number(form.employee_id) : null;
      console.log("Employee ID:", id, "Raw:", form.employee_id);
      return id;
    })(),
    
    employee_amount: (() => {
      const amount = isEmployeeCategory ? Number(form.employee_amount) : null;
      console.log("Employee amount:", amount, "Raw:", form.employee_amount);
      return amount;
    })()
  };
  console.log("Sending payload:", payload);
  console.log("Sending payload:", payload);
console.log("Payload JSON:", JSON.stringify(payload)); // Debug log

  // Send request
  const url = isEdit
    ? `${API_BASE_URL}/api/finance/${id}`
    : `${API_BASE_URL}/api/add-finance`;

  try {
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const responseData = await res.json();
 console.log("Response data:", responseData);

    if (!res.ok) {
      alert(responseData.message || "Save failed");
      return;
    }

    alert(responseData.message || "Success!");
    navigate("/finances");
  } catch (err) {
    console.error("Network error:", err);
    alert("Network error. Please check console.");
  }
};



  const isEmployeeCategory =
    form.category === "Salary" || form.category === "Incentives";

//  const toISODate = (d) => {
//   if (!d) return null;
  
//   // Input type="date" already returns yyyy-mm-dd
//   // Just validate it
//   if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
//     return d;
//   }
  
//   // If somehow it's not in the right format, try to parse
//   const parts = d.split('-');
//   if (parts.length === 3) {
//     // Check if it's dd-mm-yyyy or yyyy-mm-dd
//     if (parts[0].length === 4) {
//       // yyyy-mm-dd
//       return d;
//     } else {
//       // dd-mm-yyyy → convert to yyyy-mm-dd
//       const [dd, mm, yyyy] = parts;
//       return `${yyyy}-${mm}-${dd}`;
//     }
//   }
  
//   return d; // fallback
// };

const toISODate = (d) => {
  console.log("toISODate input:", d);
  
  if (!d) {
    console.log("toISODate: No date provided");
    return null;
  }
  
  // Input type="date" already returns yyyy-mm-dd
  // Just validate it
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
    console.log("toISODate: Already in yyyy-mm-dd format");
    return d;
  }
  
  // If somehow it's not in the right format, try to parse
  const parts = d.split('-');
  console.log("toISODate parts:", parts);
  
  if (parts.length === 3) {
    // Check if it's dd-mm-yyyy or yyyy-mm-dd
    if (parts[0].length === 4) {
      // yyyy-mm-dd
      console.log("toISODate: Detected yyyy-mm-dd format");
      return d;
    } else {
      // dd-mm-yyyy → convert to yyyy-mm-dd
      const [dd, mm, yyyy] = parts;
      const result = `${yyyy}-${mm}-${dd}`;
      console.log("toISODate: Converted dd-mm-yyyy to:", result);
      return result;
    }
  }
  
  console.log("toISODate: Could not parse, returning as-is:", d);
  return d; // fallback
};

  return (
    <div className="layout-wrapper">
      <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} />

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="finance-form-content">
        <div className="finance-form-wrapper">
          <h2>{isEdit ? "Edit Finance" : "Add Finance"}</h2>

          <form className="finance-form" onSubmit={handleSubmit}>
            {/* TYPE */}
            <select name="type" value={form.type} onChange={handleChange}>
              <option>Income</option>
              <option>Expense</option>
            </select>

            {/* CATEGORY */}
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option>Commission</option>
              <option>Travel</option>
              <option>Promotions</option>
              <option>Salary</option>
              <option>Incentives</option>
            </select>

            {/* EMPLOYEE FIELDS */}
{isEmployeeCategory && (
  <>
    <select
      name="employee_id"
      value={form.employee_id}
      onChange={handleChange}
      required
    >
      <option value="">Select Employee</option>
      {employees.map(emp => (
        <option key={emp.user_id} value={emp.user_id}>
          {emp.name}
        </option>
      ))}
    </select>

    <input
      type="number"
      name="employee_amount"
      placeholder="Employee Amount"
      value={form.employee_amount}
      onChange={handleChange}
      required
    />
  </>
)}
{isEmployeeCategory && (
  <>
    <select
      name="employee_id"
      value={form.employee_id}
      onChange={handleChange}
      required
    >
      <option value="">Select Employee</option>
      {employees.map(emp => (
        <option key={emp.user_id} value={emp.user_id}>
          {emp.name}
        </option>
      ))}
    </select>

    <input
      type="number"
      name="employee_amount"
      placeholder="Employee Amount"
      value={form.employee_amount}
      onChange={handleChange}
      required
    />
  </>
)}

            {/* PROPERTY */}
          {!isEmployeeCategory && (
  <input
    name="property_name"
    placeholder={
      form.category === "Commission"
        ? "Property Name (required)"
        : "Property Name (optional)"
    }
    value={form.property_name}
    onChange={handleChange}
    required={form.category === "Commission"}
  />
)}

            {/* TOTAL */}
           {!isEmployeeCategory && (
  <input
    type="number"
    name="amount"
    placeholder="Total Amount"
    value={form.amount}
    onChange={handleChange}
    required
  />
)}


            {/* DATE */}
            <input
              type="date"
              name="record_date"
              value={form.record_date}
              onChange={handleChange}
              required
            />

            {/* NOTES */}
            <textarea
              name="notes"
              placeholder="Notes"
              value={form.notes}
              onChange={handleChange}
            />

            <button type="submit">
              {isEdit ? "Update" : "Save"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
