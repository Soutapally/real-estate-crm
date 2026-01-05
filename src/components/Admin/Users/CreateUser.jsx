import React, { useEffect, useState } from "react";
import "./CreateUser.css";
import Button from "../../Buttons/Buttons";
import { useAuth } from "../../Login/AuthContext";
import Topbar from "../../Navbar/Topbar";
import Sidebar from "../../Navbar/Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../Config/api";

const CreateUser = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
    is_active: 1,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* LOAD USER FOR EDIT */
  useEffect(() => {
    if (!isEdit) return;

fetch(`${API_BASE_URL}/api/admin/users/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          name: data.name,
          email: data.email,
          password: "",
          role: data.role,
          is_active: data.is_active,
        });
      });
  }, [id, isEdit]);

  const update = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setError("");
    setMessage("");

    const url = isEdit
  ? `${API_BASE_URL}/api/admin/users/${id}`
  : `${API_BASE_URL}/api/admin/create-user`;


    const method = isEdit ? "PUT" : "POST";

    const payload = isEdit
      ? {
          name: form.name,
          email: form.email,
          role: form.role,
          is_active: form.is_active,
        }
      : {
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Operation failed");
        return;
      }

      setMessage(isEdit ? "User updated successfully" : "User created successfully");

      if (!isEdit) {
        setForm({ name: "", email: "", password: "", role: "USER", is_active: 1 });
      }

      if (isEdit) {
        setTimeout(() => navigate("/users-list"), 800);
      }
    } catch {
      setError("Server error");
    }
  };

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

      <main className="create-user-content">
        <div className="create-user-card">
          <h2>{isEdit ? "Edit User" : "Create User"}</h2>

          {user && (
            <p className="logged-user">
              Logged in as <b>{user.email}</b> ({user.role})
            </p>
          )}

          <form onSubmit={submit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={update}
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={update}
              required
            />

            {!isEdit && (
              <div className="password-field">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={update}
                  required
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </span>
              </div>
            )}

            <select name="role" value={form.role} onChange={update}>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>

            {isEdit && (
              <select
                name="is_active"
                value={form.is_active}
                onChange={update}
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            )}

            {error && <p className="error">{error}</p>}
            {message && <p className="success">{message}</p>}

            <Button
              label={isEdit ? "Update User" : "Create User"}
              type="submit"
              width="100%"
            />
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateUser;
