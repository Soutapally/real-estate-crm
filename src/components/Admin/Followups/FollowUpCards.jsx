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

  // ✅ SAME FUNCTION, ONLY TIMEZONE FIXED
/* ================= DATE NORMALIZATION ================= */

const parsePostgresTimestamp = (value) => {
  if (!value) return null;
  
  // PostgreSQL stores timestamp without timezone: "YYYY-MM-DD HH:mm:ss"
  // Treat it as LOCAL time (not UTC)
  const [datePart, timePart] = value.split(' ');
  if (!datePart || !timePart) return null;
  
  // Create local date object
  // Use "YYYY-MM-DDTHH:mm:ss" format
  const isoString = `${datePart}T${timePart}`;
  const d = new Date(isoString);
  
  // ✅ NO timezone adjustment - treat as local time as stored
  return isNaN(d.getTime()) ? null : d;
};

// ✅ normalizeDate should also use local time
const normalizeDate = (dt) => {
  const d = parsePostgresTimestamp(dt);
  if (!d) return null;
  
  // Create a new date at midnight LOCAL time
  const midnight = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return midnight.getTime();
};

// ✅ formatFollowupTime - CORRECTED
const formatFollowupTime = (dt) => {
  const d = parsePostgresTimestamp(dt);
  if (!d) return "—";
  
  // Format date in local time
  const dateStr = d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  
  // Format time in 12-hour format
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert 0 to 12
  
  return `${dateStr}, ${hours}:${minutes} ${ampm}`;
};
  /* ================= TODAY / UPCOMING / MISSED ================= */

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
        📅 {formatFollowupTime(f.next_followup_at)}
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
            <h2 className="fu-section-title">Today</h2>
            {todaysList.length === 0
              ? <p className="fu-empty">No follow-ups</p>
              : todaysList.map((f) => renderCard(f, "today"))}
          </div>

          <div className="fu-section fu-upcoming-border">
            <h2 className="fu-section-title">Upcoming</h2>
            {upcomingList.length === 0
              ? <p className="fu-empty">No upcoming</p>
              : upcomingList.map((f) => renderCard(f, "upcoming"))}
          </div>

          <div className="fu-section fu-missed-border">
            <h2 className="fu-section-title">Missed</h2>
            {missedList.length === 0
              ? <p className="fu-empty">No missed</p>
              : missedList.map((f) => renderCard(f, "missed"))}
          </div>
        </div>
      </main>
    </div>
  );
}
