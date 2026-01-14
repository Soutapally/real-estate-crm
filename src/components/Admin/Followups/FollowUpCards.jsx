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
  useEffect(() => {
  if (followups.length > 0) {
    console.log("Sample followup data:", followups[0]);
    console.log("next_followup_at type:", typeof followups[0].next_followup_at);
    console.log("next_followup_at value:", followups[0].next_followup_at);
  }
}, [followups]);

  /* ================= DATE NORMALIZATION ================= */

  // ✅ SAME FUNCTION, ONLY TIMEZONE FIXED
/* ================= DATE NORMALIZATION ================= */
/* ================= DATE NORMALIZATION ================= */
/* ================= DATE NORMALIZATION ================= */
const parsePostgresTimestamp = (value) => {
  if (!value) return null;
  
  if (typeof value !== 'string') return null;
  
  // PostgreSQL stores timestamp without timezone: "YYYY-MM-DD HH:mm:ss"
  const [datePart, timePart] = value.split(' ');
  
  if (!datePart || !timePart) return null;
  
  // Create LOCAL date (not UTC)
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes, seconds] = timePart.split(':').map(Number);
  
  // Create local date object
  return new Date(year, month - 1, day, hours || 0, minutes || 0, seconds || 0);
};

// Get only the date part (ignoring time) in LOCAL time
const getDateOnly = (date) => {
  if (!date) return null;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

// Format for display - LOCAL time
const formatFollowupTime = (dt) => {
  const d = parsePostgresTimestamp(dt);
  if (!d) return "—";
  
  const dateStr = d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12;
  
  return `${dateStr}, ${hours}:${minutes} ${ampm}`;
};
/* ================= TODAY / UPCOMING / MISSED ================= */

const today = new Date();
const todayDateOnly = getDateOnly(today);

// Debug: Log what we're getting
console.log("Today date:", todayDateOnly.toISOString().split('T')[0]);
console.log("Total followups:", followups.length);

// Filter using string comparison (more reliable)
const todaysList = followups.filter(f => {
  if (!f.next_followup_at) return false;
  
  const followupDate = parsePostgresTimestamp(f.next_followup_at);
  if (!followupDate) return false;
  
  const followupDateOnly = getDateOnly(followupDate);
  
  // Compare as strings (YYYY-MM-DD)
  const todayStr = todayDateOnly.toISOString().split('T')[0];
  const followupStr = followupDateOnly.toISOString().split('T')[0];
  
  console.log("Comparing:", todayStr, "with", followupStr);
  return todayStr === followupStr;
});

const upcomingList = followups.filter(f => {
  if (!f.next_followup_at) return false;
  
  const followupDate = parsePostgresTimestamp(f.next_followup_at);
  if (!followupDate) return false;
  
  const followupDateOnly = getDateOnly(followupDate);
  return followupDateOnly > todayDateOnly;
});

const missedList = followups.filter(f => {
  if (!f.next_followup_at) return false;
  
  const followupDate = parsePostgresTimestamp(f.next_followup_at);
  if (!followupDate) return false;
  
  const followupDateOnly = getDateOnly(followupDate);
  return followupDateOnly < todayDateOnly;
});

// Debug logs
console.log("Today's followups:", todaysList.length);
console.log("Upcoming followups:", upcomingList.length);
console.log("Missed followups:", missedList.length);

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
<div style={{background: '#f0f0f0', padding: '15px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ccc'}}>
        <h3>🔍 Debug Information</h3>
        <p><strong>Today's Date:</strong> {new Date().toLocaleDateString('en-IN')}</p>
        <p><strong>Total Followups:</strong> {followups.length}</p>
        <p><strong>Today's Count:</strong> {todaysList.length}</p>
        <p><strong>Upcoming Count:</strong> {upcomingList.length}</p>
        <p><strong>Missed Count:</strong> {missedList.length}</p>
        
        {followups.length > 0 && (
          <div style={{marginTop: '10px'}}>
            <p><strong>All Followups:</strong></p>
            {followups.map((f, index) => (
              <div key={index} style={{marginBottom: '5px', padding: '5px', background: 'white', borderRadius: '4px'}}>
                <p style={{margin: 0}}><strong>Customer:</strong> {f.customer_name}</p>
                <p style={{margin: 0}}><strong>DB Date:</strong> {f.next_followup_at}</p>
                <p style={{margin: 0}}><strong>Formatted:</strong> {formatFollowupTime(f.next_followup_at)}</p>
                <p style={{margin: 0}}><strong>Category:</strong> {
                  todaysList.includes(f) ? 'TODAY' : 
                  upcomingList.includes(f) ? 'UPCOMING' : 
                  missedList.includes(f) ? 'MISSED' : 'UNKNOWN'
                }</p>
              </div>
            ))}
          </div>
        )}
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
