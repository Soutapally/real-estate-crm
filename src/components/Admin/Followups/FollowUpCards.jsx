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

  /* ================= DATE HELPERS ================= */

  const getDateObj = (dt) => {
    if (!dt) return null;
    const d = new Date(dt);
    return isNaN(d.getTime()) ? null : d;
  };

  const formatFollowupTime = (dt) => {
    const d = getDateObj(dt);
    if (!d) return "—";

    return d.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  /* ================= TODAY / UPCOMING / MISSED ================= */

  const now = new Date();

  const todaysList = followups.filter(f => {
    const d = new Date(f.next_followup_at);
    return d.toDateString() === now.toDateString();
  });

  const upcomingList = followups.filter(f => {
    const d = new Date(f.next_followup_at);
    return d > now && d.toDateString() !== now.toDateString();
  });

  const missedList = followups.filter(f => {
    const d = new Date(f.next_followup_at);
    return d < now && d.toDateString() !== now.toDateString();
  });

  /* ================= SORTING ================= */

  todaysList.sort((a,b)=> new Date(a.next_followup_at) - new Date(b.next_followup_at));
  upcomingList.sort((a,b)=> new Date(a.next_followup_at) - new Date(b.next_followup_at));
  missedList.sort((a,b)=> new Date(b.next_followup_at) - new Date(a.next_followup_at));

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

      {f.notes && (
        <p className="fu-notes">{f.notes}</p>
      )}

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
              : todaysList.map((f) => renderCard(f,"today"))
            }
          </div>


          <div className="fu-section fu-upcoming-border">
            <h2 className="fu-section-title">Upcoming</h2>

            {upcomingList.length === 0
              ? <p className="fu-empty">No upcoming</p>
              : upcomingList.map((f)=> renderCard(f,"upcoming"))
            }
          </div>


          <div className="fu-section fu-missed-border">
            <h2 className="fu-section-title">Missed</h2>

            {missedList.length === 0
              ? <p className="fu-empty">No missed</p>
              : missedList.map((f)=> renderCard(f,"missed"))
            }
          </div>

        </div>

      </main>

    </div>
  );
}