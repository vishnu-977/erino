import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function LoginRegister() {
  const [email, setEmail] = useState("test@demo.com");
  const [password, setPassword] = useState("test1234");
  const [mode, setMode] = useState("login");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      const path = mode === "login" ? "/auth/login" : "/auth/register";
      await api(path, { method: "POST", body: { email, password } });
      nav("/leads");
    } catch (e) { setErr(e.message); }
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 12, maxWidth: 360, margin: "80px auto" }}>
      <h3>{mode === "login" ? "Login" : "Register"}</h3>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required />
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" required />
      {err && <div style={{ color:"crimson" }}>{err}</div>}
      <button type="submit">{mode === "login" ? "Login" : "Register"}</button>
      <button type="button" onClick={()=>setMode(mode==="login"?"register":"login")}>
        Switch to {mode==="login"?"Register":"Login"}
      </button>
    </form>
  );
}
