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
        console.log("Loaded data for ID", id, ":", data); // Add this line

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

  // Build payload with ALL fields (some will be null)
  const payload = {
    type: form.type,
    category: form.category,
    
    // Default all optional fields to null
    property_name: null,
    amount: 0,
    employee_id: null,
    employee_amount: null,
    notes: form.notes?.trim() || null
  };

  // Set values based on category
  if (isEmployeeCategory) {
    console.log("Processing Employee Category (Salary/Incentives)");
    
    // For Salary/Incentives
    payload.property_name = null;  // Explicitly null
    payload.amount = form.employee_amount ? Number(form.employee_amount) : 0;
    payload.employee_id = form.employee_id ? Number(form.employee_id) : null;
    payload.employee_amount = form.employee_amount ? Number(form.employee_amount) : null;
    
    console.log("Employee Amount:", payload.employee_amount);
    console.log("Employee ID:", payload.employee_id);
    
  } else if (form.category === "Commission") {
    console.log("Processing Commission Category");
    
    // For Commission
    payload.property_name = form.property_name?.trim() || null;
    payload.amount = form.amount ? Number(form.amount) : 0;
    payload.employee_id = null;  // Explicitly null
    payload.employee_amount = null;  // Explicitly null
    
    console.log("Property Name:", payload.property_name);
    console.log("Amount:", payload.amount);
    
  } else {
    console.log("Processing Other Category (Travel, Promotions, etc.)");
    
    // For other categories (Travel, Promotions, etc.)
    payload.property_name = form.property_name?.trim() || null;
    payload.amount = form.amount ? Number(form.amount) : 0;
    payload.employee_id = null;  // Explicitly null
    payload.employee_amount = null;  // Explicitly null
    
    console.log("Property Name:", payload.property_name);
    console.log("Amount:", payload.amount);
  }

  // Add record date (already in yyyy-mm-dd format from input type="date")
  payload.record_date = form.record_date;
  console.log("Record Date:", payload.record_date);

  // Log final payload
  console.log("========== FINAL PAYLOAD ==========");
  console.log("Payload object:", payload);
  console.log("Payload JSON:", JSON.stringify(payload));

  // Send request
  const url = isEdit
    ? `${API_BASE_URL}/api/finance/${id}`
    : `${API_BASE_URL}/api/add-finance`;
  
  console.log("URL:", url);
  console.log("Method:", isEdit ? "PUT" : "POST");

  try {
    console.log("========== SENDING REQUEST ==========");
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    console.log("Response status:", res.status);
    console.log("Response OK:", res.ok);

    const responseData = await res.json();
    console.log("Response data:", responseData);

    if (!res.ok) {
      console.error("❌ API Error:", responseData);
      alert(responseData.message || `Save failed (Status: ${res.status})`);
      return;
    }

    console.log("✅ Success! Response:", responseData);
    alert(responseData.message || "Success!");
    navigate("/finances");
    
  } catch (err) {
    console.error("❌ Network/Fetch error:", err);
    alert("Network error. Check console for details.");
  }
  
  console.log("========== FORM SUBMIT END ==========");
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
