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
  /* ================= DEBUG DATA ================= */
useEffect(() => {
  if (followups.length > 0) {
    console.log("=== DEBUG: FOLLOWUP DATA ===");
    console.log("Total followups:", followups.length);
    
    followups.forEach((f, i) => {
      console.log(`${i + 1}. Customer: ${f.customer_name}`);
      console.log(`   Raw next_followup_at: ${f.next_followup_at}`);
      console.log(`   Type: ${typeof f.next_followup_at}`);
      console.log(`   Contains 'T': ${f.next_followup_at?.includes('T')}`);
      console.log(`   Contains ' ': ${f.next_followup_at?.includes(' ')}`);
      console.log(`   Formatted: ${formatFollowupTime(f.next_followup_at)}`);
      console.log(`   Normalized: ${normalizeDate(f.next_followup_at)}`);
    });
    
    console.log("=== DEBUG: TODAY COMPARISON ===");
    console.log("Today time:", todayTime);
    console.log("Today date:", new Date(todayTime).toLocaleDateString('en-IN'));
  }
}, [followups]);

  /* ================= DATE NORMALIZATION ================= */

  // ✅ SAME FUNCTION, ONLY TIMEZONE FIXED
/* ================= DATE NORMALIZATION ================= */
/* ================= DATE NORMALIZATION ================= */
const parsePostgresTimestamp = (value) => {
  if (!value) {
    console.warn("parsePostgresTimestamp received null/undefined");
    return null;
  }
  
  // Check if value is a string
  if (typeof value !== 'string') {
    console.warn("parsePostgresTimestamp expected string, got:", typeof value, value);
    return null;
  }
  
  console.log("Parsing timestamp:", value);
  
  // Handle ISO format: "2026-01-14T09:00:00.000Z" (what you're actually getting)
  if (value.includes('T')) {
    // Remove the 'Z' and milliseconds if present
    const cleanValue = value.replace('Z', '').split('.')[0];
    const date = new Date(cleanValue);
    
    if (isNaN(date.getTime())) {
      console.warn("Invalid ISO date:", value);
      return null;
    }
    
    return date;
  }
  
  // Handle PostgreSQL format: "YYYY-MM-DD HH:mm:ss" (just in case)
  if (value.includes(' ')) {
    const [datePart, timePart] = value.split(' ');
    const isoString = `${datePart}T${timePart}`;
    const date = new Date(isoString);
    
    if (isNaN(date.getTime())) {
      console.warn("Invalid PostgreSQL date:", value);
      return null;
    }
    
    return date;
  }
  
  // Fallback
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
};

// ✅ normalizeDate should also use local time
const normalizeDate = (dt) => {
  const d = parsePostgresTimestamp(dt);
  if (!d) return null;
  
  // Create a new date at midnight LOCAL time
  const midnight = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return midnight.getTime();
};

// ✅ formatFollowupTime - UPDATED TO HANDLE ISO FORMAT
const formatFollowupTime = (dt) => {
  const d = parsePostgresTimestamp(dt);
  if (!d) return "—";
  
  console.log("Formatting date:", dt, "->", d);
  
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
  
  const result = `${dateStr}, ${hours}:${minutes} ${ampm}`;
  console.log("Formatted result:", result);
  return result;
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
