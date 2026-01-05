import "./PropertyCards.css";
import Sidebar from "../../Navbar/Sidebar";
import Topbar from "../../Navbar/Topbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import EditButton from "../../Buttons/EditButton";
import DeleteButton from "../../Buttons/DeleteButton";
import API_BASE_URL from "../../Config/api";

export default function PropertyCards() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);

  const [search, setSearch] = useState("");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("");

  /* ---------------- LOAD PROPERTIES ---------------- */
  const loadProperties = async () => {
    try {
const res = await fetch(`${API_BASE_URL}/api/properties`);
      const data = await res.json();
      setProperties(data);
      setFilteredProperties(data);
    } catch (err) {
      console.error("❌ Error loading properties:", err);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  /* ---------------- DELETE PROPERTY ---------------- */
  const handleDeleteProperty = async (propertyId) => {
    try {
     const res = await fetch(
  `${API_BASE_URL}/api/delete-property/${propertyId}`,
  { method: "DELETE" }
);
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Delete failed");
        return;
      }

      // 🔥 Remove from UI instantly
      setProperties((prev) =>
        prev.filter((p) => p.property_id !== propertyId)
      );
      setFilteredProperties((prev) =>
        prev.filter((p) => p.property_id !== propertyId)
      );
    } catch (err) {
      console.error("❌ Delete property error:", err);
      alert("Something went wrong");
    }
  };

  /* ---------------- APPLY FILTERS ---------------- */
  useEffect(() => {
    let list = [...properties];

    if (search.trim()) {
      list = list.filter((p) =>
        `${p.property_name} ${p.owner_name}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (propertyTypeFilter !== "All") {
      list = list.filter(
        (p) =>
          p.property_type?.toLowerCase() ===
          propertyTypeFilter.toLowerCase()
      );
    }

    if (locationFilter.trim()) {
      list = list.filter((p) =>
        `${p.mandal || ""} ${p.address || ""} ${p.district || ""}`
          .toLowerCase()
          .includes(locationFilter.toLowerCase())
      );
    }

    setFilteredProperties(list);
  }, [search, propertyTypeFilter, locationFilter, properties]);

  const propertyTypes = [
    "All",
    ...new Set(properties.map((p) => p.property_type).filter(Boolean)),
  ];

  return (
    <div className="layout-wrapper">
      <Sidebar />
      <Topbar />

      <div className="properties-content">

        {/* HEADER */}
        <div className="properties-header">
          <div>
            <h1>Properties</h1>
            <p>Your property inventory</p>
          </div>

          <button
            className="add-btn"
            onClick={() => navigate("/add-properties")}
          >
            + Add Property
          </button>
        </div>

        {/* FILTERS */}
        <div className="property-filters">
          <input
            className="property-filter-input"
            placeholder="Search by property name or owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="property-filter-select"
            value={propertyTypeFilter}
            onChange={(e) => setPropertyTypeFilter(e.target.value)}
          >
            {propertyTypes.map((pt) => (
              <option key={pt} value={pt}>{pt}</option>
            ))}
          </select>

          <input
            className="property-filter-location"
            placeholder="Search by mandal, address or district..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
        </div>

        {/* PROPERTY CARDS */}
        <div className="property-grid">
          {filteredProperties.map((p) => (
            <div className="property-card" key={p.property_id}>

              {/* 🔥 EDIT + DELETE */}
              {/* 🔥 EDIT + DELETE */}
<div className="property-edit-btn">
  <EditButton
    width="80px"
    onClick={() =>
      navigate(`/edit-property/${p.property_id}`)
    }
  />
  <DeleteButton
    onClick={() =>
      handleDeleteProperty(p.property_id)
    }
  />
</div>


              <span className="property-type">{p.property_type}</span>

              <h2 className="property-title">{p.property_name}</h2>

              <p className="property-location">
                {p.address}, {p.mandal}, {p.district}
              </p>

              <p className="property-price">₹{p.price}</p>

              <span className={`status-tag ${p.availability?.toLowerCase()}`}>
                {p.availability}
              </span>

              <div className="property-details">
                <p><b>Size:</b> {p.area_value} {p.area_unit}</p>
                <p><b>Owner:</b> {p.owner_name || "Unknown"}</p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
