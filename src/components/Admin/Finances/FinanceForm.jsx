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
  }, [id, isEdit]);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

 const handleSubmit = async (e) => {
  e.preventDefault();

  const isEmployeeCategory =
    form.category === "Salary" || form.category === "Incentives";

  const payload = {
    type: form.type,
    category: form.category,

    // 🔥 IMPORTANT
    property_name: isEmployeeCategory ? null : form.property_name || null,

    amount: Number(form.amount),

    record_date: form.record_date,

    notes: form.notes || null,

    employee_id: isEmployeeCategory ? Number(form.employee_id) : null,

    employee_amount: isEmployeeCategory
      ? Number(form.employee_amount)
      : null
  };

  const url = isEdit
    ? `${API_BASE_URL}/api/finance/${id}`
    : `${API_BASE_URL}/api/add-finance`;

  const res = await fetch(url, {
    method: isEdit ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.json();
    alert(err.message || "Save failed");
    return;
  }

  navigate("/finances");
};



  const isEmployeeCategory =
    form.category === "Salary" || form.category === "Incentives";

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

            {/* PROPERTY */}
            {!isEmployeeCategory && (
              <input
                name="property_name"
                placeholder="Property Name"
                value={form.property_name}
                onChange={handleChange}
              />
            )}

            {/* TOTAL */}
            <input
              type="number"
              name="amount"
              placeholder="Total Amount"
              value={form.amount}
              onChange={handleChange}
              required
            />

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
