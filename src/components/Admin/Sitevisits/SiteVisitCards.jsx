import React, { useEffect, useState } from "react";
import Sidebar from "../../Navbar/Sidebar";
import Topbar from "../../Navbar/Topbar";
import EditButton from "../../Buttons/EditButton";
import DeleteButton from "../../Buttons/DeleteButton";
import { useNavigate } from "react-router-dom";
import "./SiteVisitCards.css";
import API_BASE_URL from "../../Config/api";

export default function SiteVisitCards() {
  const navigate = useNavigate();
  const [visits, setVisits] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchSiteVisits();
  }, []);

  /* ================= FETCH ================= */
  const fetchSiteVisits = async () => {
    try {
const res = await fetch(`${API_BASE_URL}/api/site-visits`);
      const data = await res.json();
      setVisits(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading site visits", err);
      setVisits([]);
    }
  };

  const handleDelete = async (visitId) => {
    if (!window.confirm("Delete this site visit?")) return;

    await fetch(`${API_BASE_URL}/api/site-visit/${visitId}`, {
  method: "DELETE",
});


    fetchSiteVisits();
  };

  // const formatDate = (dt) =>
  //   new Date(dt).toLocaleDateString("en-IN");

  // const formatTime = (dt) =>
  //   new Date(dt).toLocaleTimeString("en-IN", {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     hour12: true,
  //   });
// const parseDBTimestamp = (value) => {
//   if (!value) return null;

//   const [datePart, timePart] = value.split(" ");
//   const [y, m, d] = datePart.split("-").map(Number);
//   const [hh, mm] = timePart.split(":").map(Number);

//   return new Date(y, m - 1, d, hh, mm); // 👈 LOCAL
// };
const parseDBTimestamp = (value) => {
  if (!value || typeof value !== "string" || !value.includes(" ")) {
    return null;
  }

  const [datePart, timePart] = value.split(" ");
  if (!datePart || !timePart) return null;

  const [y, m, d] = datePart.split("-").map(Number);
  const [hh, mm] = timePart.split(":").map(Number);

  if ([y, m, d, hh, mm].some(isNaN)) return null;

  return new Date(y, m - 1, d, hh, mm);
};


const formatDate = (dt) => {
  const d = parseDBTimestamp(dt);
  return d ? d.toLocaleDateString("en-IN") : "—";
};

const formatTime = (dt) => {
  const d = parseDBTimestamp(dt);
  return d
    ? d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true, // ✅ 24h → 12h AM/PM
      })
    : "—";
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

      <main className="sv-content">
        <div className="sv-container">
          {/* HEADER */}
          <div className="sv-header">
            <div>
              <h1>Site Visits</h1>
              <p>Track property visits and customer interest</p>
            </div>

            <button
              className="sv-add-btn"
              onClick={() => navigate("/siteVisitForm")}
            >
              + Schedule Visit
            </button>
          </div>

          {/* LIST */}
          <div className="sv-list">
            {visits.length === 0 ? (
              <p className="sv-empty">No site visits found</p>
            ) : (
              visits.map((visit) => (
                <div className="sv-card" key={visit.visit_id}>
                  <div className="sv-top">
                    <h3>{visit.customer_name}</h3>

                    <div className="sv-actions">
                      <EditButton
                        label="Edit"
                        width="80px"
                        onClick={() =>
                          navigate(`/edit-site-visit/${visit.visit_id}`)
                        }
                      />
                      <DeleteButton
                        label="Delete"
                        width="80px"
                        onClick={() => handleDelete(visit.visit_id)}
                      />
                    </div>
                  </div>

                  <div className="sv-datetime">
                    <span>
                      Date: <b>{formatDate(visit.visit_datetime)}</b>
                    </span>
                    <span>
                      Time: <b>{formatTime(visit.visit_datetime)}</b>
                    </span>
                  </div>

                  <hr />

                  <div className="sv-properties">
                    {visit.properties.map((p, i) => (
                      <div className="sv-property-row" key={i}>
                        <div className="sv-property-header">
                          <span className="sv-property-name">
                            {p.property_name}
                          </span>

                          <span
                            className={`sv-status ${
                              p.status === "Completed"
                                ? "completed"
                                : p.status === "Cancelled"
                                ? "cancelled"
                                : "scheduled"
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>

                        {p.feedback && (
                          <div className="sv-feedback-box">
                            {p.feedback}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
