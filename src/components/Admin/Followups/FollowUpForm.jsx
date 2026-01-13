import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../Navbar/Sidebar";
import Topbar from "../../Navbar/Topbar";
import Button from "../../Buttons/Buttons";
import { useNavigate, useParams } from "react-router-dom";
import "./FollowUpForm.css";
import API_BASE_URL from "../../Config/api";

const INITIAL_FORM = {
  customer_id: "",
  property_ids: [],
  followup_date: "",
  hour: "",
  minute: "",
  meridiem: "AM",
  status: "",
  notes: "",
  showPropertyDropdown: false
};

export default function FollowUpForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dropdownRef = useRef(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [updated, setUpdated] = useState(false);

  /* LOAD CUSTOMERS & PROPERTIES */
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/customers-list`)
      .then(res => res.json())
      .then(setCustomers);

   fetch(`${API_BASE_URL}/api/properties-list`)
      .then(res => res.json())
      .then(setProperties);
  }, []);

  /* EDIT MODE */
//   useEffect(() => {
//     if (!isEdit) return;

//     fetch(`${API_BASE_URL}/api/edit-followup/${id}`)
//       .then(res => res.json())
//       .then(data => {
//         // const dt = new Date(data.next_followup_at);
//         const safe = data.next_followup_at.replace(" ", "T");
// const dt = new Date(`${safe}+05:30`);

//         let h = dt.getHours();
//         let mer = "AM";

//         if (h >= 12) {
//           mer = "PM";
//           if (h > 12) h -= 12;
//         }
//         if (h === 0) h = 12;

//         setForm({
//           customer_id: String(data.customer_id),
//           property_ids: data.property_ids.map(String),
//           followup_date: dt.toISOString().split("T")[0],
//           hour: String(h),
//           minute: String(dt.getMinutes()).padStart(2, "0"),
//           meridiem: mer,
//           status: data.status || "",
//           notes: data.notes || "",
//           showPropertyDropdown: false
//         });
//       });
//   }, [id, isEdit]);


/* EDIT MODE */
/* EDIT MODE */
useEffect(() => {
  if (!isEdit) return;

  fetch(`${API_BASE_URL}/api/edit-followup/${id}`)
    .then(res => res.json())
    .then(data => {
      if (!data) return;

      // Parse PostgreSQL timestamp "YYYY-MM-DD HH:mm:ss"
      const [datePart, timePart] = data.next_followup_at.split(' ');
      const [year, month, day] = datePart.split('-');
      const [hours24, minutes] = timePart.split(':');
      
      // Convert 24-hour to 12-hour for form display
      let hours12 = parseInt(hours24, 10);
      let meridiem = "AM";
      
      if (hours12 >= 12) {
        meridiem = "PM";
        if (hours12 > 12) hours12 -= 12;
      }
      if (hours12 === 0) hours12 = 12;
      
      setForm({
        customer_id: String(data.customer_id),
        property_ids: data.property_ids.map(String),
        followup_date: `${year}-${month}-${day}`,
        hour: String(hours12),
        minute: minutes,
        meridiem: meridiem,
        status: data.status || "",
        notes: data.notes || "",
        showPropertyDropdown: false
      });
    });
}, [id, isEdit]);


  /* CLOSE PROPERTY DROPDOWN */
  useEffect(() => {
    const handler = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setForm(f => ({ ...f, showPropertyDropdown: false }));
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const toggleProperty = pid => {
    setForm(f => ({
      ...f,
      property_ids: f.property_ids.includes(pid)
        ? f.property_ids.filter(i => i !== pid)
        : [...f.property_ids, pid]
    }));
  };

const buildDateTime = () => {
  let h = parseInt(form.hour, 10);
  
  // Convert 12-hour to 24-hour format
  if (form.meridiem === "PM" && h !== 12) h += 12;
  if (form.meridiem === "AM" && h === 12) h = 0;
  
  // Pad hour and minute to 2 digits
  const hour24 = String(h).padStart(2, "0");
  const minute24 = String(form.minute).padStart(2, "0");
  
  // Return in PostgreSQL format: "YYYY-MM-DD HH:MM:SS"
  return `${form.followup_date} ${hour24}:${minute24}:00`;
};

  const handleSubmit = async e => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    await fetch(
  isEdit
    ? `${API_BASE_URL}/api/update-followup/${id}`
    : `${API_BASE_URL}/api/add-followup`,
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: Number(form.customer_id),
          property_ids: form.property_ids.map(Number),
          next_followup_at: buildDateTime(),
          status: form.status,
          notes: form.notes
        })
      }
    );

    if (isEdit) {
      setUpdated(true);
      navigate("/add-followups", { replace: true });
      return;
    }

    setForm(INITIAL_FORM);
    setSubmitting(false);
  };

  if (updated) return null;

  return (
    <div className="app-layout">
<Topbar toggleSidebar={() => setSidebarOpen(prev => !prev)} />
      <Sidebar isOpen={sidebarOpen} />

      <main className="app-content">
        <div className="followup-form-wrapper">
          <div className="followup-form-card">
            <h2 className="followup-title">Schedule Follow-up</h2>

            <form className="followup-form-column" onSubmit={handleSubmit}>
              <select
                className="followup-input"
                name="customer_id"
                value={form.customer_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Customer</option>
                {customers.map(c => (
                  <option key={c.customer_id} value={c.customer_id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <label className="followup-label">
                Select Properties (Multiple)
              </label>

              <div className="multi-select-container" ref={dropdownRef}>
                <div
                  className="multi-select-input"
                  onClick={() =>
                    setForm(f => ({
                      ...f,
                      showPropertyDropdown: !f.showPropertyDropdown
                    }))
                  }
                >
                  {form.property_ids.length === 0 ? (
                    <span className="placeholder">Select properties</span>
                  ) : (
                    <div className="selected-tags">
                      {form.property_ids.map(id => {
                        const p = properties.find(
                          x => String(x.property_id) === id
                        );
                        return (
                          <span key={id} className="tag">
                            {p?.property_name}
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                toggleProperty(id);
                              }}
                            >
                              ×
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                  <span className="arrow">▾</span>
                </div>

                {form.showPropertyDropdown && (
                  <div className="multi-select-dropdown">
                    {properties.map(p => {
                      const pid = String(p.property_id);
                      return (
                        <label key={pid} className="dropdown-item">
                          <input
                            type="checkbox"
                            checked={form.property_ids.includes(pid)}
                            onChange={() => toggleProperty(pid)}
                          />
                          {p.property_name}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              <input
                type="date"
                className="followup-input"
                name="followup_date"
                value={form.followup_date}
                onChange={handleChange}
                required
              />

              <div className="followup-time-row">
                <select
                  className="followup-input"
                  name="hour"
                  value={form.hour}
                  onChange={handleChange}
                  required
                >
                  <option value="">HH</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>

                <select
  className="followup-input"
  name="minute"
  value={form.minute}
  onChange={handleChange}
  required
>
  <option value="">MM</option>
  {[...Array(60)].map((_, i) => {
    const v = String(i).padStart(2, "0");
    return (
      <option key={v} value={v}>
        {v}
      </option>
    );
  })}
</select>

                <select
                  className="followup-input"
                  name="meridiem"
                  value={form.meridiem}
                  onChange={handleChange}
                >
                  <option>AM</option>
                  <option>PM</option>
                </select>
              </div>

              <select
                className="followup-input"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="">Select Status</option>
                <option>New</option>
                <option>Pending</option>
                <option>Done</option>
              </select>

              <textarea
                className="followup-textarea"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Notes"
              />

              <Button
                label={isEdit ? "Update" : "Save"}
                type="submit"
                disabled={submitting}
              />
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
