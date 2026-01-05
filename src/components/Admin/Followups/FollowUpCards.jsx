import React, { useEffect, useState } from "react";
import Sidebar from "../../Navbar/Sidebar";
import Topbar from "../../Navbar/Topbar";
import EditButton from "../../Buttons/EditButton";
import { useNavigate } from "react-router-dom";
import "./FollowUpCards.css";
import API_BASE_URL from "../../Config/api";

export default function FollowUpCards() {
  const navigate = useNavigate();
  const [followups, setFollowups] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ================= LOAD FOLLOWUPS ================= */
  const loadFollowUps = async () => {
    try {
const res = await fetch(`${API_BASE_URL}/api/followups`);
      const data = await res.json();
      setFollowups(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading followups:", err);
      setFollowups([]);
    }
  };

  useEffect(() => {
    loadFollowUps();
  }, []);

  /* ================= DATE NORMALIZATION ================= */
  const normalizeDate = (dt) => {
    if (!dt) return null;
    const d = new Date(dt);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTime = today.getTime();

  const todaysList = followups.filter(
    (f) => normalizeDate(f.next_followup_at) === todayTime
  );

  const upcomingList = followups.filter(
    (f) => normalizeDate(f.next_followup_at) > todayTime
  );

  const missedList = followups.filter(
    (f) => normalizeDate(f.next_followup_at) < todayTime
  );

  /* ================= CARD ================= */
  const renderCard = (f, type) => (
    <div className={`fu-item-card inner-${type}`} key={f.followup_id}>
      <div className="fu-item-header">
        <b>{f.customer_name}</b>
        <EditButton
          width="70px"
          label="Edit"
          onClick={() => navigate(`/edit-followup/${f.followup_id}`)}
        />
      </div>

      <p className="fu-time">
        📅{" "}
        {new Date(f.next_followup_at).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </p>

      {f.properties && (
        <p className="fu-properties">
          🏠 <b>Property:</b> {f.properties}
        </p>
      )}

      <p className="fu-notes">{f.notes}</p>
    </div>
  );

  return (
    <div className="layout-wrapper">
      <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="fu-content">
        <div className="fu-header">
          <div>
            <h1>Follow-ups</h1>
            <p>Never miss a customer interaction</p>
          </div>

          <button
            className="fu-add-btn"
            onClick={() => navigate("/followups")}
          >
            + Schedule Follow-up
          </button>
        </div>

        <div className="fu-sections">
          <div className="fu-section fu-today-border">
            <h2 className="fu-section-title">
              <span className="fu-dot yellow"></span>
              Today
            </h2>
            {todaysList.length === 0
              ? <p className="fu-empty">No follow-ups</p>
              : todaysList.map((f) => renderCard(f, "today"))}
          </div>

          <div className="fu-section fu-upcoming-border">
            <h2 className="fu-section-title">
              <span className="fu-dot blue"></span>
              Upcoming
            </h2>
            {upcomingList.length === 0
              ? <p className="fu-empty">No upcoming</p>
              : upcomingList.map((f) => renderCard(f, "upcoming"))}
          </div>

          <div className="fu-section fu-missed-border">
            <h2 className="fu-section-title">
              <span className="fu-dot red"></span>
              Missed
            </h2>
            {missedList.length === 0
              ? <p className="fu-empty">No missed</p>
              : missedList.map((f) => renderCard(f, "missed"))}
          </div>
        </div>
      </main>
    </div>
  );
}
