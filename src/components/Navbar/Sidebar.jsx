import { NavLink } from "react-router-dom";
import { useAuth } from "../Login/AuthContext";
import "./Sidebar.css";

const Sidebar = ({ isOpen }) => {
  const { user } = useAuth();
  const role = user?.role; // "ADMIN" or "USER"

  return (
    <div className={`sidebar-container ${isOpen ? "open" : ""}`}>
      <div className="sidebar-menu">

        <NavLink to="/dashboard" className="sidebar-item">
          Dashboard
        </NavLink>

        <NavLink to="/customers" className="sidebar-item">
          Customers
        </NavLink>

        <NavLink to="/sellers" className="sidebar-item">
          Clients
        </NavLink>

        <NavLink to="/properties" className="sidebar-item">
          Properties
        </NavLink>

        <NavLink to="/add-followups" className="sidebar-item">
          Follow-ups
        </NavLink>

        <NavLink to="/site-visits" className="sidebar-item">
          Site Visits
        </NavLink>

        <NavLink to="/propertyTypeForm" className="sidebar-item">
          Property Type
        </NavLink>

        {/* ADMIN ONLY */}
        {role === "ADMIN" && (
          <>
            <NavLink to="/sales" className="sidebar-item">
              Sales
            </NavLink>

            <NavLink to="/finances" className="sidebar-item">
              Finances
            </NavLink>

            <div className="sidebar-divider">Admin</div>

            <NavLink to="/admin/create-user" className="sidebar-item">
              Create User
            </NavLink>

            <NavLink to="/users-list" className="sidebar-item">
              Users List
            </NavLink>
          </>
        )}

      </div>
    </div>
  );
};

export default Sidebar;
