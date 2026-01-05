import React, { useEffect, useState } from "react";
import Sidebar from "../../Navbar/Sidebar";
import Topbar from "../../Navbar/Topbar";
import EditButton from "../../Buttons/EditButton";
import DeleteButton from "../../Buttons/DeleteButton";
import { useNavigate } from "react-router-dom";
import "./SalesCards.css";
import API_BASE_URL from "../../Config/api";

export default function SalesCards() {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
const res = await fetch(`${API_BASE_URL}/api/sales`);
      const data = await res.json();
      setSales(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Load sales error:", err);
    }
  };

  const handleDelete = async (saleId) => {
    const ok = window.confirm("Are you sure you want to delete this sale?");
    if (!ok) return;
await fetch(`${API_BASE_URL}/api/sale/${saleId}`, {
  method: "DELETE",
});

    loadSales();
  };

  const formatAmount = (v) =>
    v ? `₹${Number(v).toLocaleString("en-IN")}` : "₹0";

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN") : "-";

  return (
    <div className="layout-wrapper">
      {/* TOPBAR */}
      <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* SIDEBAR */}
      <Sidebar isOpen={sidebarOpen} />

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <main className="salesCards-content">
        {/* HEADER */}
        <div className="salesCards-header">
          <div>
            <h1>Sales Tracking</h1>
            <p>Track closed deals and commissions</p>
          </div>

          <button
            className="salesCards-addBtn"
            onClick={() => navigate("/salesForm")}
          >
            + Add Sale
          </button>
        </div>

        {/* LIST */}
        <div className="salesCards-list">
          {sales.length === 0 ? (
            <p className="salesCards-empty">No sales found</p>
          ) : (
            sales.map((s) => (
              <div className="salesCards-card" key={s.sale_id}>
                {/* TOP */}
                <div className="salesCards-cardTop">
                  <div>
                    <h3>{s.buyer_name}</h3>
                    <p className="salesCards-property">
                      {s.property_name}
                    </p>
                  </div>

                  <div className="salesCards-amount">
                    {formatAmount(s.sale_price)}
                    <span>
                      Commission: {formatAmount(s.commission_amount)}
                    </span>
                  </div>
                </div>

                <hr className="salesCards-divider" />

                {/* BOTTOM */}
                <div className="salesCards-cardBottom">
                  <div>
                    <b>Sale Date:</b> {formatDate(s.sale_date)}
                  </div>

                  <div className="salesCards-notes">
                    {s.notes || "No notes"}
                  </div>

                  <div className="salesCards-actions">
                    <EditButton
                      label="Edit"
                      width="80px"
                      onClick={() =>
                        navigate(`/edit-sale/${s.sale_id}`)
                      }
                    />
                    <DeleteButton
                      label="Delete"
                      width="80px"
                      onClick={() => handleDelete(s.sale_id)}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
