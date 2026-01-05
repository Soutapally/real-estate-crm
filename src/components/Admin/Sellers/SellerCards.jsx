import "./SellerCards.css";
import Sidebar from "../../Navbar/Sidebar";
import Topbar from "../../Navbar/Topbar";
import EditButton from "../../Buttons/EditButton";
import DeleteButton from "../../Buttons/DeleteButton";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API_BASE_URL from "../../Config/api";

export default function SellerCards() {
  const navigate = useNavigate();

  /* ================= SIDEBAR STATE ================= */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [sellers, setSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);

  const [search, setSearch] = useState("");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("");

  const loadSellers = async () => {
    try {
const res = await fetch(`${API_BASE_URL}/api/sellers`);
      const data = await res.json();
      setSellers(data);
      setFilteredSellers(data);
    } catch (err) {
      console.error("❌ Error loading sellers:", err);
    }
  };

  useEffect(() => {
    loadSellers();
  }, []);

  const handleDeleteSeller = async (sellerId) => {
    try {
      const res = await fetch(
  `${API_BASE_URL}/api/delete-seller/${sellerId}`,
  { method: "DELETE" }
);

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Delete failed");
        return;
      }

      setSellers((prev) =>
        prev.filter((s) => s.seller_id !== sellerId)
      );
      setFilteredSellers((prev) =>
        prev.filter((s) => s.seller_id !== sellerId)
      );
    } catch (err) {
      console.error("❌ Delete seller error:", err);
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    let list = [...sellers];

    if (search.trim()) {
      list = list.filter((s) =>
        `${s.name} ${s.phone} ${s.property_name}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (propertyTypeFilter !== "All") {
      list = list.filter(
        (s) =>
          s.property_type &&
          s.property_type.toLowerCase() ===
            propertyTypeFilter.toLowerCase()
      );
    }

    if (locationFilter.trim()) {
      list = list.filter((s) =>
        `${s.address} ${s.city} ${s.district}`
          .toLowerCase()
          .includes(locationFilter.toLowerCase())
      );
    }

    setFilteredSellers(list);
  }, [search, propertyTypeFilter, locationFilter, sellers]);

  const propertyTypes = [
    "All",
    ...new Set(
      sellers.map((s) => s.property_type).filter(Boolean)
    ),
  ];

  return (
    <div className="layout-wrapper">
      {/* ✅ SIDEBAR */}
      <Sidebar isOpen={sidebarOpen} />

      {/* ✅ TOPBAR CONTROLS SIDEBAR */}
      <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="seller-content">

        <div className="sellers-header">
          <div>
            <h1>Sellers / Clients</h1>
            <p>Property owners and sellers</p>
          </div>

          <button
            className="sellers-add-btn"
            onClick={() => navigate("/add-sellers")}
          >
            + Add Client
          </button>
        </div>

        <div className="seller-filters">
          <input
            className="seller-filter-input"
            placeholder="Search by name, phone or property..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="seller-filter-select"
            value={propertyTypeFilter}
            onChange={(e) => setPropertyTypeFilter(e.target.value)}
          >
            {propertyTypes.map((pt) => (
              <option key={pt} value={pt}>
                {pt}
              </option>
            ))}
          </select>

          <input
            className="seller-filter-input"
            placeholder="Search by location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
        </div>

        <div className="sellers-grid">
          {filteredSellers.map((s) => (
            <div className="seller-card" key={s.seller_id}>

              {s.property_type && (
                <span className="seller-property-type-badge">
                  {s.property_type}
                </span>
              )}

              <div className="edit-btn-wrapper">
                <EditButton
                  onClick={() =>
                    navigate(`/edit-seller/${s.seller_id}`)
                  }
                />
                <DeleteButton
                  onClick={() =>
                    handleDeleteSeller(s.seller_id)
                  }
                />
              </div>

              <h2 className="seller-name">{s.name}</h2>
              <p className="seller-email">{s.email}</p>

              <div className="seller-row">
                <div>
                  <span className="seller-label">Phone:</span>
                  <p className="seller-phone">{s.phone}</p>
                </div>

                <div>
                  <span className="seller-label">Seller Type:</span>
                  <p className="seller-type">
                    {s.seller_type || "N/A"}
                  </p>
                </div>
              </div>

              <div className="seller-section">
                <span className="seller-label">Location:</span>
                <p className="seller-value">
                  {s.address}, {s.city}, {s.district}
                </p>
              </div>

              <div className="seller-section">
                <span className="seller-label">Property:</span>
                <p className="seller-value-bold">
                  {s.property_name || "—"}
                </p>
              </div>

              {s.notes && (
                <div className="seller-notes">
                  <p className="seller-note-text">{s.notes}</p>
                </div>
              )}

              <div className="seller-added">
                Added on: {s.created_at?.substring(0, 10)}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
