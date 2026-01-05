import { useNavigate } from "react-router-dom";
import { useAuth } from "../Login/AuthContext";
import "./Topbar.css";

export default function Topbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* ☰ MENU BUTTON (MOBILE / TABLET ONLY) */}
        <button className="menu-btn" onClick={toggleSidebar}>
          ☰
        </button>

        <h2 className="topbar-title">Karimnagar Properties</h2>
      </div>

      <div className="topbar-right">
        {user && (
          <div className="topbar-user">
            <img
              src="https://i.pravatar.cc/40"
              alt="profile"
              className="topbar-avatar"
            />

            <div className="topbar-info">
              <span className="topbar-name">{user.name}</span>
              <br />
              <span className="topbar-role">{user.role}</span>
            </div>
          </div>
        )}

        <button className="topbar-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
