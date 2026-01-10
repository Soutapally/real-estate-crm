import React, { useEffect, useState } from "react";
import Sidebar from "../../Navbar/Sidebar";
import Topbar from "../../Navbar/Topbar";
import Button from "../../Buttons/Buttons";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./SiteVisitForm.css";
import API_BASE_URL from "../../Config/api";

const EMPTY_ROW = {
  property_id: "",
  status: "Scheduled",
  feedback: ""
};

export default function SiteVisitForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const isEdit = Boolean(id);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const prefilledCustomerId = location.state?.customer_id || "";
  const prefilledPropertyId = location.state?.property_id || "";

  const [customers, setCustomers] = useState([]);
  const [properties, setProperties] = useState([]);

  const [customerId, setCustomerId] = useState(prefilledCustomerId);
  const [visitDate, setVisitDate] = useState("");
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [meridiem, setMeridiem] = useState("AM");
  const [timeTouched, setTimeTouched] = useState(false);

  const [followUpDate, setFollowUpDate] = useState("");

  const [rows, setRows] = useState(
    prefilledPropertyId
      ? [{ ...EMPTY_ROW, property_id: prefilledPropertyId }]
      : [{ ...EMPTY_ROW }]
  );

  /* ================= LOAD DROPDOWNS ================= */
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/customers-list`)
      .then(res => res.json())
      .then(setCustomers);

    fetch(`${API_BASE_URL}/api/properties-list`)
      .then(res => res.json())
      .then(setProperties);
  }, []);

  /* ================= PREFILL EDIT ================= */
//   useEffect(() => {
//     if (!isEdit) return;

//    fetch(`${API_BASE_URL}/api/site-visit-group/${id}`)
//       .then(res => res.json())
//       .then(rows => {
//         if (!rows.length) return;

// //         const first = rows[0];
// //         // const dt = new Date(first.visit_datetime);
// // const safe = first.visit_datetime.replace(" ", "T");
// // const dt = new Date(`${safe}+05:30`);

// //         setCustomerId(first.customer_id);
// //         setVisitDate(dt.toISOString().split("T")[0]);

// //         let h = dt.getHours();
// //         setMeridiem(h >= 12 ? "PM" : "AM");
// //         h = h % 12 || 12;
// //         setHour(h.toString());
// //         setMinute(dt.getMinutes().toString().padStart(2, "0"));

// //         if (first.followup_datetime) {
// //           setFollowUpDate(
// //             new Date(first.followup_datetime).toISOString().split("T")[0]
// //           );
// //         }
// const first = rows[0];

// setCustomerId(first.customer_id);

// /* ✅ SAFE VISIT DATETIME PREFILL */
// if (first.visit_datetime) {
//   const [datePart, timePart] = first.visit_datetime.split(" ");
//   const [y, m, d] = datePart.split("-").map(Number);
//   const [hh, mm] = timePart.split(":").map(Number);

//   const dt = new Date(y, m - 1, d, hh, mm); // 👈 LOCAL TIME

//   setVisitDate(datePart);

//   let h = dt.getHours();
//   setMeridiem(h >= 12 ? "PM" : "AM");
//   h = h % 12 || 12;
//   setHour(String(h));
//   setMinute(String(mm).padStart(2, "0"));
// }



// /* ✅ SAFE FOLLOW-UP DATE PREFILL */
// if (first.followup_datetime) {
//   const safeFU = first.followup_datetime.replace(" ", "T");
//   const fdt = new Date(`${safeFU}+05:30`);

//   if (!isNaN(fdt.getTime())) {
//     setFollowUpDate(fdt.toISOString().split("T")[0]);
//   }
// }

//         setRows(
//           rows.map(r => ({
//             property_id: r.property_id,
//             status: r.status,
//             feedback: r.feedback || ""
//           }))
//         );
//       });
//   }, [id, isEdit]);

useEffect(() => {
  if (!isEdit || !location.state?.visit_datetime) return;

  const d = new Date(location.state.visit_datetime);
  if (isNaN(d.getTime())) return;

  setVisitDate(d.toISOString().slice(0, 10));

  // set time only if real time exists
  if (!(d.getHours() === 0 && d.getMinutes() === 0)) {
    let h = d.getHours();
    setMeridiem(h >= 12 ? "PM" : "AM");
    h = h % 12 || 12;
    setHour(String(h));
    setMinute(String(d.getMinutes()).padStart(2, "0"));
    setTimeTouched(true);
  }
}, [isEdit, location.state]);

useEffect(() => {
  if (!isEdit) return;

  fetch(`${API_BASE_URL}/api/site-visit-group/${id}`)
    .then(res => res.json())
    .then(rows => {
      if (!rows.length) return;

      const first = rows[0];

      setCustomerId(first.customer_id);

      // ✅ VISIT DATE
      const visitDateOnly = extractDateForInput(first.visit_datetime);
      setVisitDate(visitDateOnly);

      // ✅ TIME (mark as touched only if real time exists)
      if (first.visit_datetime) {
        const d = new Date(first.visit_datetime);
        if (!isNaN(d.getTime()) && !(d.getHours() === 0 && d.getMinutes() === 0)) {
          let h = d.getHours();
          setMeridiem(h >= 12 ? "PM" : "AM");
          h = h % 12 || 12;
          setHour(String(h));
          setMinute(String(d.getMinutes()).padStart(2, "0"));
          setTimeTouched(true); // 🔴 THIS WAS MISSING
        }
      }

      // ✅ FOLLOW-UP DATE
      const followupDateOnly = extractDateForInput(first.followup_datetime);
      setFollowUpDate(followupDateOnly);

      // ✅ PROPERTIES
      setRows(
        rows.map(r => ({
          property_id: r.property_id,
          status: r.status,
          feedback: r.feedback || ""
        }))
      );
    });
}, [id, isEdit]);


  /* ================= HELPERS ================= */
  const buildDateTime = () => {
  if (!timeTouched) {
    return `${visitDate} 00:00:00`; // intentional no-time
  }

  let h = parseInt(hour, 10);
  if (meridiem === "PM" && h !== 12) h += 12;
  if (meridiem === "AM" && h === 12) h = 0;

  return `${visitDate} ${String(h).padStart(2, "0")}:${minute}:00`;
};


  const buildFollowupDateTime = () => {
    if (!followUpDate) return null;
    let h = parseInt(hour, 10);
    if (meridiem === "PM" && h !== 12) h += 12;
    if (meridiem === "AM" && h === 12) h = 0;
    return `${followUpDate} ${String(h).padStart(2, "0")}:${minute}:00`;
  };

  const updateRow = (i, field, value) => {
    const copy = [...rows];
    copy[i][field] = value;
    setRows(copy);
  };

  const addRow = () => setRows([...rows, { ...EMPTY_ROW }]);
  const removeRow = (i) => setRows(rows.filter((_, idx) => idx !== i));
  
const extractDateForInput = (value) => {
  if (!value) return "";

  // If already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  // If ISO or "YYYY-MM-DD HH:mm:ss"
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";

  return d.toISOString().slice(0, 10); // ✅ YYYY-MM-DD ONLY
};


  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerId || !visitDate) {
      alert("Customer and Visit Date are required");
      return;
    }

    const payload = {
      customer_id: customerId,
      visit_datetime: buildDateTime(),
      followup_datetime: buildFollowupDateTime(),
      properties: rows.filter(r => r.property_id)
    };

    const url = isEdit
  ? `${API_BASE_URL}/api/update-site-visit/${id}`
  : `${API_BASE_URL}/api/add-site-visit-multiple`;

    await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    navigate("/site-visits");
  };

  return (
    <div className="layout-wrapper">
      <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} />

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="sv-form-content">
        <div className="form-wrapper">
          <div className="form-card">
            <h2>{isEdit ? "Edit Site Visit" : "Schedule Site Visit"}</h2>

            <form className="form-column" onSubmit={handleSubmit}>
              <label>Customer</label>
              <select value={customerId} onChange={e => setCustomerId(e.target.value)} required>
                <option value="">Select Customer</option>
                {customers.map(c => (
                  <option key={c.customer_id} value={c.customer_id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <label>Visit Date</label>
              <input type="date" value={visitDate} onChange={e => setVisitDate(e.target.value)} required />

              <label>Follow-up Date (Optional)</label>
              <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} />

              <label>Visit Time</label>
              <div className="time-row">
                {/* <select value={hour} onChange={e => setHour(e.target.value)}> */}
                <select
  value={hour}
  onChange={e => {
    setHour(e.target.value);
    setTimeTouched(true); // 👈 add this
  }}
>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1}>{i + 1}</option>
                  ))}
                </select>

                {/* <select value={minute} onChange={e => setMinute(e.target.value)}> */}
                <select
  value={minute}
  onChange={e => {
    setMinute(e.target.value);
    setTimeTouched(true); // 👈 add this
  }}
>
                  {[...Array(60)].map((_, i) => {
                    const v = String(i).padStart(2, "0");
                    return <option key={v}>{v}</option>;
                  })}
                </select>

                {/* <select value={meridiem} onChange={e => setMeridiem(e.target.value)}> */}
                <select
  value={meridiem}
  onChange={e => {
    setMeridiem(e.target.value);
    setTimeTouched(true); // 👈 add this
  }}
>
                  <option>AM</option>
                  <option>PM</option>
                </select>
              </div>

              <h4>Visited Properties</h4>

              {rows.map((row, i) => (
                <div className="property-card-row" key={i}>
                  <select
                    value={row.property_id}
                    onChange={e => updateRow(i, "property_id", e.target.value)}
                  >
                    <option value="">Select Property</option>
                    {properties.map(p => (
                      <option key={p.property_id} value={p.property_id}>
                        {p.property_name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={row.status}
                    onChange={e => updateRow(i, "status", e.target.value)}
                  >
                    <option>Scheduled</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>

                  <textarea
                    placeholder="Feedback"
                    value={row.feedback}
                    onChange={e => updateRow(i, "feedback", e.target.value)}
                  />

                  {rows.length > 1 && (
                    <button type="button" className="remove-btn" onClick={() => removeRow(i)}>
                      ✖
                    </button>
                  )}
                </div>
              ))}

              <button type="button" className="add-btn" onClick={addRow}>
                ➕ Add Another Property
              </button>

              <Button label="Save Site Visit" type="submit" />
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
