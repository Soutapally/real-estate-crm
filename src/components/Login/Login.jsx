import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./Login.css";
import Button from "../Buttons/Buttons";
import API_BASE_URL from "../Config/api";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // ✅ STORE USER VIA CONTEXT
      login(data.user);

      navigate("/dashboard");
    } catch {
      setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">Karimnagar Properties 👋</h2>
        <p className="login-sub">Login to your CRM Dashboard</p>

        <form onSubmit={submit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={update}
            required
          />

          <div className="password-field">
            <input
              type={showPwd ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={update}
              required
            />
            <span
              className="pwd-eye"
              onClick={() => setShowPwd(!showPwd)}
            >
              {showPwd ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>

          {error && <p className="login-error">{error}</p>}

          <Button
            label={loading ? "Logging in..." : "Login"}
            type="submit"
            width="100%"
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
};

export default Login;
