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
const parseTimestamp = (value) => {
  if (!value) return null;
  
  console.log("Parsing timestamp:", value);
  
  // Your database returns: "2026-01-14T09:00:00.000Z"
  // Create Date object directly
  const date = new Date(value);
  
  if (isNaN(date.getTime())) {
    console.error("Invalid date:", value);
    return null;
  }
  
  // Convert to IST (UTC+5:30)
  const istDate = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
  
  return istDate;
};

// Format for display
const formatFollowupTime = (dt) => {
  const d = parseTimestamp(dt);
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

// Get current date in IST
const getTodayIST = () => {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(now.getTime() + istOffset);
  return new Date(istNow.getFullYear(), istNow.getMonth(), istNow.getDate());
};

const todayIST = getTodayIST();
const todayStr = todayIST.toISOString().split('T')[0];

console.log("Today's date (IST):", todayStr);
console.log("Today's local display:", todayIST.toLocaleDateString('en-IN'));

// Filter followups
const todaysList = followups.filter(f => {
  if (!f.next_followup_at) return false;
  
  const followupDate = parseTimestamp(f.next_followup_at);
  if (!followupDate) return false;
  
  const followupDateOnly = new Date(
    followupDate.getFullYear(),
    followupDate.getMonth(),
    followupDate.getDate()
  );
  
  const followupStr = followupDateOnly.toISOString().split('T')[0];
  
  return followupStr === todayStr;
});

const upcomingList = followups.filter(f => {
  if (!f.next_followup_at) return false;
  
  const followupDate = parseTimestamp(f.next_followup_at);
  if (!followupDate) return false;
  
  const followupDateOnly = new Date(
    followupDate.getFullYear(),
    followupDate.getMonth(),
    followupDate.getDate()
  );
  
  return followupDateOnly > todayIST;
});

const missedList = followups.filter(f => {
  if (!f.next_followup_at) return false;
  
  const followupDate = parseTimestamp(f.next_followup_at);
  if (!followupDate) return false;
  
  const followupDateOnly = new Date(
    followupDate.getFullYear(),
    followupDate.getMonth(),
    followupDate.getDate()
  );
  
  return followupDateOnly < todayIST;
});

console.log("Filter results:", {
  total: followups.length,
  today: todaysList.length,
  upcoming: upcomingList.length,
  missed: missedList.length,
  todayDate: todayStr
});
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
