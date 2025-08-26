import React, { useEffect, useState } from "react";
import { api } from "../api";
import { useNavigate, useParams } from "react-router-dom";

const SOURCES = ["website","facebook_ads","google_ads","referral","events","other"];
const STATUSES = ["new","contacted","qualified","lost","won"];

export default function LeadForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const [lead, setLead] = useState({
    first_name:"", last_name:"", email:"", phone:"",
    company:"", city:"", state:"",
    source:"website", status:"new", score:0, lead_value:0, is_qualified:false,
    last_activity_at: ""
  });
  const [err, setErr] = useState("");

  useEffect(()=> {
    if (!id) return;
    (async ()=> {
      try { const data = await api(`/leads/${id}`); setLead({ ...data, last_activity_at: data.last_activity_at ? data.last_activity_at.slice(0,16) : "" }); }
      catch(e){ setErr(e.message); }
    })();
  }, [id]);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    const body = { ...lead, score: Number(lead.score), lead_value: Number(lead.lead_value),
      last_activity_at: lead.last_activity_at ? new Date(lead.last_activity_at).toISOString() : null
    };
    try {
      if (id) await api(`/leads/${id}`, { method: "PUT", body });
      else await api(`/leads`, { method: "POST", body });
      nav("/leads");
    } catch (e) { setErr(e.message); }
  }

  return (
    <form onSubmit={submit} style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12, maxWidth: 800 }}>
      <h3 style={{ gridColumn: "1/-1" }}>{id ? "Edit Lead" : "Create Lead"}</h3>
      {err && <div style={{ color:"crimson", gridColumn:"1/-1" }}>{err}</div>}
      <input placeholder="First name" value={lead.first_name} onChange={e=>setLead(l=>({...l, first_name:e.target.value}))} required />
      <input placeholder="Last name" value={lead.last_name} onChange={e=>setLead(l=>({...l, last_name:e.target.value}))} required />
      <input placeholder="Email" value={lead.email} onChange={e=>setLead(l=>({...l, email:e.target.value}))} required />
      <input placeholder="Phone" value={lead.phone} onChange={e=>setLead(l=>({...l, phone:e.target.value}))} />
      <input placeholder="Company" value={lead.company} onChange={e=>setLead(l=>({...l, company:e.target.value}))} />
      <input placeholder="City" value={lead.city} onChange={e=>setLead(l=>({...l, city:e.target.value}))} />
      <input placeholder="State" value={lead.state} onChange={e=>setLead(l=>({...l, state:e.target.value}))} />

      <select value={lead.source} onChange={e=>setLead(l=>({...l, source:e.target.value}))}>
        {SOURCES.map(s=><option key={s} value={s}>{s}</option>)}
      </select>
      <select value={lead.status} onChange={e=>setLead(l=>({...l, status:e.target.value}))}>
        {STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
      </select>

      <input type="number" placeholder="Score (0-100)" value={lead.score} onChange={e=>setLead(l=>({...l, score:e.target.value}))} />
      <input type="number" placeholder="Lead value" value={lead.lead_value} onChange={e=>setLead(l=>({...l, lead_value:e.target.value}))} />
      <label style={{ display:"flex", alignItems:"center", gap:8 }}>
        <input type="checkbox" checked={lead.is_qualified} onChange={e=>setLead(l=>({...l, is_qualified:e.target.checked}))} /> Qualified
      </label>
      <label>
        Last activity (local):
        <input type="datetime-local" value={lead.last_activity_at} onChange={e=>setLead(l=>({...l, last_activity_at:e.target.value}))} />
      </label>

      <div style={{ gridColumn:"1/-1", display:"flex", gap:8 }}>
        <button type="submit">{id ? "Update" : "Create"}</button>
      </div>
    </form>
  );
}
