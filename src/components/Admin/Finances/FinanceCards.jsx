import React, { useEffect, useState } from "react";
import Sidebar from "../../Navbar/Sidebar";
import Topbar from "../../Navbar/Topbar";
import { useNavigate } from "react-router-dom";
import "./FinanceCards.css";
import API_BASE_URL from "../../Config/api";

export default function FinanceCards() {
  const [list, setList] = useState([]);
  const [tab, setTab] = useState("Income");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  /* LOAD DATA */
  useEffect(() => {
    loadFinances();
  }, []);

  const loadFinances = async () => {
    try {
const res = await fetch(`${API_BASE_URL}/api/finances`);
      const data = await res.json();
      setList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Load finances error:", err);
    }
  };

  /* DELETE */
  const handleDelete = async (financeId) => {
    const ok = window.confirm("Delete this record?");
    if (!ok) return;

    await fetch(`${API_BASE_URL}/api/finance/${financeId}`, {
      method: "DELETE",
    });

    setList((prev) => prev.filter(f => f.finance_id !== financeId));
  };

  /* TOTALS */
  const incomeTotal = list
    .filter(i => i.type === "Income")
    .reduce((a, b) => a + Number(b.amount), 0);

  const expenseTotal = list
    .filter(i => i.type === "Expense")
    .reduce((a, b) => a + Number(b.amount), 0);

  const filtered = list.filter(i => i.type === tab);

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

      <main className="finance-content">
        {/* HEADER */}
        <div className="finance-header">
          <div>
            <h1>Finances</h1>
            <p>Track income and expenses</p>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="finance-summary">
          <div className="summary-card income">
            <p>Total Income</p>
            <h2>₹{incomeTotal.toLocaleString()}</h2>
            <span>This month</span>
          </div>

          <div className="summary-card expense">
            <p>Total Expenses</p>
            <h2>₹{expenseTotal.toLocaleString()}</h2>
            <span>This month</span>
          </div>

          <div className="summary-card profit">
            <p>Net Profit</p>
            <h2>₹{(incomeTotal - expenseTotal).toLocaleString()}</h2>
            <span>This month</span>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="finance-toolbar">
          <div className="tabs">
            <button
              className={tab === "Income" ? "active" : ""}
              onClick={() => setTab("Income")}
            >
              Income
            </button>
            <button
              className={tab === "Expense" ? "active" : ""}
              onClick={() => setTab("Expense")}
            >
              Expenses
            </button>
          </div>

          <button
            className="add-btn"
            onClick={() => navigate("/financeForm")}
          >
            + Add {tab}
          </button>
        </div>

        {/* LIST */}
        {filtered.length === 0 ? (
          <p className="finance-empty">No records found</p>
        ) : (
          filtered.map(f => (
            <div className="finance-card" key={f.finance_id}>
              <div>
                <span className="badge">{f.category}</span>
                <h3>{f.property_name}</h3>
                <p>
                  {new Date(f.record_date).toLocaleDateString("en-IN")}
                </p>
              </div>

              <div className="right">
                <h2>₹{Number(f.amount).toLocaleString()}</h2>

                <div className="finance-actions">
                  <button
                    className="edit-btn"
                    onClick={() =>
                      navigate(`/finance-form/${f.finance_id}`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(f.finance_id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
