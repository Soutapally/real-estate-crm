import React, { useEffect, useState } from "react";
import "./UsersList.css";
import Topbar from "../../Navbar/Topbar";
import Sidebar from "../../Navbar/Sidebar";
import EditButton from "../../Buttons/EditButton";
import DeleteButton from "../../Buttons/DeleteButton";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../Config/api";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
fetch(`${API_BASE_URL}/api/admin/users`)
      .then(res => res.json())
      .then(data => {
        setUsers(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleEdit = userId => {
    navigate(`/edit-user/${userId}`);
  };

  const handleDelete = userId => {
    if (!window.confirm("Delete this user?")) return;

    fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
      method: "DELETE",
    }).then(() => {
      setUsers(prev => prev.filter(u => u.user_id !== userId));
    });
  };

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading users...</p>;
  }

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

      <main className="userslist-content">
        <h2 className="userslist-title">Users</h2>

        <div className="userslist-table-wrapper">
          <table className="userslist-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created At</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u, index) => (
                <tr key={u.user_id}>
                  <td>{index + 1}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span
                      className={`userslist-role userslist-role-${u.role.toLowerCase()}`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>
                    {u.is_active ? (
                      <span className="userslist-active">Active</span>
                    ) : (
                      <span className="userslist-inactive">Inactive</span>
                    )}
                  </td>
                  <td>
                    {new Date(u.created_at).toLocaleDateString("en-IN")}
                  </td>
                  <td>
                    <div className="userslist-actions">
                      <EditButton
                        label=""
                        onClick={() => handleEdit(u.user_id)}
                      />
                      <DeleteButton
                        label=""
                        onClick={() => handleDelete(u.user_id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default UsersList;
