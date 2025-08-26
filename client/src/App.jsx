import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { api } from "./api";

export default function App() {
  const navigate = useNavigate();
  async function logout() {
    await api("/auth/logout", { method: "POST" });
    localStorage.removeItem("me");
    navigate("/auth");
  }
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      <header style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ marginRight: "auto" }}>Erino Leads</h2>
        <Link to="/leads">Leads</Link>
        <Link to="/leads/new">Create Lead</Link>
        <button onClick={logout}>Logout</button>
      </header>
      <Outlet />
    </div>
  );
}
