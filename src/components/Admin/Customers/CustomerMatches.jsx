import React, { useEffect, useState } from "react";
import Sidebar from "../../Navbar/Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import "./CustomerMatches.css";
import Topbar from "../../Navbar/Topbar";
import API_BASE_URL from "../../Config/api";

export default function CustomerMatches() {
  const { id } = useParams();
  const navigate = useNavigate();

  /* ================= SIDEBAR STATE ================= */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [customer, setCustomer] = useState(null);
  const [properties, setProperties] = useState([]);
  const [siteVisits, setSiteVisits] = useState([]);

  useEffect(() => {
    loadCustomer();
    loadMatches();
    loadSiteVisits();
  }, []);

  const loadCustomer = async () => {
    const res = await fetch(`${API_BASE_URL}/api/customer/${id}`);
    const data = await res.json();
    setCustomer(data);
  };

  const loadMatches = async () => {
    const res = await fetch(
      `${API_BASE_URL}/api/customers/${id}/matched-properties`
    );
    const data = await res.json();
    setProperties(Array.isArray(data) ? data : []);
  };

  const loadSiteVisits = async () => {
    const res = await fetch(
      `${API_BASE_URL}/api/customers/${id}/completed-site-visits`
    );
    const data = await res.json();
    setSiteVisits(Array.isArray(data) ? data : []);
  };

  if (!customer) return null;

  return (
    <div className="layout-wrapper">
      {/* ✅ SIDEBAR WITH STATE */}
      <Sidebar isOpen={sidebarOpen} />

      {/* ✅ TOPBAR CONTROLS SIDEBAR */}
      <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="matches-page">
        <div className="matches-container">

          {/* ================= CUSTOMER SUMMARY ================= */}
          <div className="customer-summary">
            <h2>{customer.name}</h2>

            <div className="summary-grid">
              <div>
                <span className="label">Budget</span>
                <p>₹{customer.budget_min} – ₹{customer.budget_max}</p>
              </div>

              <div>
                <span className="label">Location</span>
                <p>{customer.preferred_location}</p>
              </div>

              <div>
                <span className="label">Interested Type</span>
                <p>{customer.property_type}</p>
              </div>
            </div>

            <div className="requirement-box">
              <span className="label">Requirement</span>
              <p>{customer.requirement_details}</p>
            </div>
          </div>

          {/* ================= SITE VISITS ================= */}
          <div className="sitevisits-section">
            <h3>🏡 Site Visits (Completed)</h3>

            {siteVisits.length === 0 && (
              <p className="no-visits">No completed site visits yet.</p>
            )}

            <div className="sitevisits-grid">
              {siteVisits.map(v => (
                <div className="sitevisit-card" key={v.site_visit_id}>

                  <div className="sitevisit-header">
                    <h4>{v.property_name}</h4>
                    <span className="visit-badge">Visited</span>
                  </div>

                  <p className="visit-date">
                    📅 {new Date(v.visit_datetime).toLocaleDateString()}
                  </p>

                  {v.feedback && (
                    <div className="visit-feedback">
                      <strong>Feedback</strong>
                      <p>{v.feedback}</p>
                    </div>
                  )}

                </div>
              ))}
            </div>
          </div>

          {/* ================= MATCHED PROPERTIES ================= */}
          <div className="matches-grid">
            {properties.length === 0 && (
              <p className="no-matches">No matching properties found.</p>
            )}

            {properties.map((p) => {
              const matchedReasons = [];

              if (p.mandal_match) matchedReasons.push("Mandal matched");
              if (p.district_match) matchedReasons.push("District matched");
              if (p.address_match) matchedReasons.push("Address matched");
              if (p.type_match) matchedReasons.push("Property type matched");
              if (p.budget_match) matchedReasons.push("Budget matched");
              if (p.requirement_match) matchedReasons.push("Requirement matched");

              return (
                <div className="property-card" key={p.property_id}>
                  <div className="match-reason">
                    <strong>Matched because:</strong>
                    <ul>
                      {matchedReasons.map((r, i) => (
                        <li key={i}>✅ {r}</li>
                      ))}
                    </ul>
                  </div>

                  <h3>{p.title}</h3>
                  <p className="price">₹{p.price}</p>
                  <p className="location">{p.mandal}, {p.district}</p>

                  <div className="property-features">
                    <span>{p.property_type}</span>
                    <span>{p.area_value} {p.area_unit}</span>
                    <span>{p.availability}</span>
                  </div>

                  <p className="desc">{p.address}</p>

                  <div className="property-actions">
                    <button
                      className="visit-btn"
                      onClick={() =>
                        navigate("/siteVisitForm", {
                          state: {
                            customer_id: customer.customer_id,
                            property_id: p.property_id,
                          },
                        })
                      }
                    >
                      Schedule Visit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
