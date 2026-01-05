import "./CustomersCards.css";
import Sidebar from "../../Navbar/Sidebar";
import Topbar from "../../Navbar/Topbar";
import EditButton from "../../Buttons/EditButton";
import DeleteButton from "../../Buttons/DeleteButton";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API_BASE_URL from "../../Config/api";

export default function CustomersCards() {
  const navigate = useNavigate();

  /* =========================
     SIDEBAR STATE (REQUIRED)
  ========================= */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("");

  /* ---------------- LOAD CUSTOMERS ---------------- */
  const loadCustomers = async () => {
    try {
     const res = await fetch(
  `${API_BASE_URL}/api/customers-with-matches`
);

      const data = await res.json();

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.customers)
        ? data.customers
        : Array.isArray(data.data)
        ? data.data
        : [];

      setCustomers(list);
      setFiltered(list);
    } catch (err) {
      console.error("❌ Error loading customers:", err);
      setCustomers([]);
      setFiltered([]);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  /* ---------------- DELETE CUSTOMER ---------------- */
  const handleDeleteCustomer = async (customerId) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/delete-customer/${customerId}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Delete failed");
        return;
      }

      setCustomers((prev) =>
        prev.filter((c) => c.customer_id !== customerId)
      );
      setFiltered((prev) =>
        prev.filter((c) => c.customer_id !== customerId)
      );
    } catch (err) {
      console.error("❌ Delete error:", err);
      alert("Something went wrong");
    }
  };

  /* ---------------- FILTER LOGIC ---------------- */
  useEffect(() => {
    let list = [...customers];

    if (search.trim()) {
      list = list.filter((c) =>
        c.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      list = list.filter(
        (c) => c.lead_status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (locationFilter.trim()) {
      list = list.filter((c) =>
        c.preferred_location
          ?.toLowerCase()
          .includes(locationFilter.toLowerCase())
      );
    }

    setFiltered(list);
  }, [search, statusFilter, locationFilter, customers]);

  return (
    <div className="layout-wrapper">
      {/* ✅ PASS STATE */}
      <Sidebar isOpen={sidebarOpen} />

      {/* ✅ PASS TOGGLE */}
      <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="customers-page">
        <div className="customers-container">

          {/* HEADER */}
          <div className="customers-header">
            <div>
              <h1>Customers</h1>
              <p>Manage your buyer pipeline</p>
            </div>

            <button
              className="customers-add-btn"
              onClick={() => navigate("/add-customers")}
            >
              + Add Customer
            </button>
          </div>

          {/* FILTERS */}
          <div className="customers-filters">
            <div className="customers-search-box">
              <span className="customers-search-icon">🔍</span>
              <input
                className="filter-input"
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Visited">Visited</option>
              <option value="Closed">Closed</option>
            </select>

            <input
              className="filter-input"
              placeholder="Search by location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>

          {/* CARDS */}
          <div className="customers-grid">
            {filtered.map((c) => (
              <div className="customer-card" key={c.customer_id}>
                <div className="customer-card-header">
                  <div>
                    <h2
                      className="customer-name clickable"
                      onClick={() =>
                        navigate(`/customers/${c.customer_id}/matches`)
                      }
                    >
                      {c.name}
                    </h2>
                    <p className="customer-email">{c.email}</p>
                  </div>

                  <div className="card-actions">
                    <span
                      className={`status-badge status-${(c.lead_status || "new")
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {c.lead_status || "New"}
                    </span>

                    <EditButton
                      onClick={() =>
                        navigate(`/edit-customer/${c.customer_id}`)
                      }
                    />

                    <DeleteButton
                      onClick={() =>
                        handleDeleteCustomer(c.customer_id)
                      }
                    />
                  </div>
                </div>

                <div className="customer-row">
                  <div>
                    <span className="customer-label">Phone</span>
                    <p className="customer-value strong">{c.phone}</p>
                  </div>
                  <div>
                    <span className="customer-label">Budget</span>
                    <p className="customer-value strong">
                      {c.budget_min} - {c.budget_max}
                    </p>
                  </div>
                </div>

                <div className="customer-row">
                  <div>
                    <span className="customer-label">Requirement</span>
                    <p className="customer-value">{c.requirement_details}</p>
                  </div>
                  <div>
                    <span className="customer-label">Location</span>
                    <p className="customer-value">{c.preferred_location}</p>
                  </div>
                </div>

                <div className="customer-last-contact">
                  Added on: {c.created_at?.substring(0, 10)}
                </div>

                <div className="customer-matches">
                  <span className="matches-count">
                    {c.matched_properties_count || 0} Properties Matched
                  </span>
                  <button
                    className="view-matches-btn"
                    onClick={() =>
                      navigate(`/customers/${c.customer_id}/matches`)
                    }
                  >
                    View Matches →
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
