import "./Dashboard.css";
import Sidebar from "../../Navbar/Sidebar";
import Topbar from "../../Navbar/Topbar";
import { useEffect, useState } from "react";
import { useAuth } from "../../Login/AuthContext";
import API_BASE_URL from "../../Config/api";

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  /* =======================
     SIDEBAR STATE (NEW)
  ======================= */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState({
    followupsToday: 0,
    siteVisits: 0,
    customers: 0,
    properties: 0,
    income: 0,
    expenses: 0,
    profit: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/api/dashboard-counts`).then((r) => r.json()),
    fetch(`${API_BASE_URL}/api/todays-followups-count`).then((r) => r.json()),
    fetch(`${API_BASE_URL}/api/monthly-site-visits-count`).then((r) => r.json()),
    ])
      .then(([main, followups, visits]) => {
        setStats({
          followupsToday: followups.count || 0,
          siteVisits: visits.count || 0,
          customers: main.customers_count || 0,
          properties: main.properties_count || 0,
          income: main.monthly_income || 0,
          expenses: main.monthly_expenses || 0,
          profit: main.net_profit || 0,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {/* ✅ SIDEBAR WITH OPEN STATE */}
      <Sidebar isOpen={sidebarOpen} />

      <div className="dashboard-main">
        {/* ✅ TOPBAR WITH TOGGLE */}
        <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="dashboard-page">
          <div className="dashboard-header">
            <h1>Dashboard</h1>
            <p>Welcome back! Here's your business overview.</p>
          </div>

          {loading ? (
            <p className="loading">Loading dashboard...</p>
          ) : (
            <div className="dashboard-stats-grid">
              {/* COMMON CARDS */}
              <Card
                title="Today's Follow-ups"
                value={stats.followupsToday}
                sub="Due today"
                icon="📅"
              />
              <Card
                title="Site Visits"
                value={stats.siteVisits}
                sub="This month"
                icon="📍"
              />
              <Card
                title="Customers"
                value={stats.customers}
                sub="Total buyers"
                icon="🧑‍💼"
              />
              <Card
                title="Available Properties"
                value={stats.properties}
                sub="Ready to sell"
                icon="🏠"
              />

              {/* ADMIN ONLY */}
              {isAdmin && (
                <>
                  <Card
                    title="Monthly Income"
                    value={`₹${(stats.income / 100000).toFixed(1)}L`}
                    sub="This month"
                    icon="⬆️"
                    positive
                  />

                  <Card
                    title="Monthly Expenses"
                    value={`₹${(stats.expenses / 1000).toFixed(0)}K`}
                    sub="This month"
                    icon="⬇️"
                  />

                  <Card
                    title="Net Profit"
                    value={`₹${(stats.profit / 100000).toFixed(1)}L`}
                    sub="This month"
                    icon="💰"
                    danger={stats.profit < 0}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* =======================
   CARD COMPONENT
======================= */

function Card({ title, value, sub, icon, positive, danger }) {
  return (
    <div className={`dashboard-stat-card ${danger ? "danger" : ""}`}>
      <div>
        <p className="dashboard-stat-title">{title}</p>
        <h2 className="dashboard-stat-value">{value}</h2>
        <span className={`dashboard-stat-sub ${positive ? "positive" : ""}`}>
          {sub}
        </span>
      </div>
      <span className="dashboard-stat-icon">{icon}</span>
    </div>
  );
}
