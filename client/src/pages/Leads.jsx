import React, { useEffect, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { api } from "../api";
import { Link } from "react-router-dom";

export default function Leads() {
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [page, setPage] = useState(0); // zero-based for DataGrid
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(false);

  // filters state
  const [filters, setFilters] = useState({
    email_contains: "",
    company_contains: "",
    city_contains: "",
    status_in: "",
    source_in: "",
    score_between: "",
    lead_value_between: "",
    created_at_between: "",
    last_activity_at_between: "",
    is_qualified: ""
  });

  // helper → remove empty/no values
  function cleanFilters(raw) {
    return Object.fromEntries(
      Object.entries(raw).filter(([_, v]) => v && v.trim() !== "" && v.trim().toLowerCase() !== "no")
    );
  }

  const columns = useMemo(
    () => [
      { field: "first_name", headerName: "First", flex: 1, valueGetter: (p) => p?.row?.first_name || "" },
      { field: "last_name", headerName: "Last", flex: 1, valueGetter: (p) => p?.row?.last_name || "" },
      { field: "email", headerName: "Email", flex: 1.4, valueGetter: (p) => p?.row?.email || "" },
      { field: "company", headerName: "Company", flex: 1, valueGetter: (p) => p?.row?.company || "" },
      { field: "city", headerName: "City", flex: 1, valueGetter: (p) => p?.row?.city || "" },
      { field: "state", headerName: "State", width: 100, valueGetter: (p) => p?.row?.state || "" },
      { field: "source", headerName: "Source", width: 140, valueGetter: (p) => p?.row?.source || "" },
      { field: "status", headerName: "Status", width: 130, valueGetter: (p) => p?.row?.status || "" },
      { field: "score", headerName: "Score", width: 100, type: "number", valueGetter: (p) => p?.row?.score ?? "" },
      { field: "lead_value", headerName: "Value", width: 120, type: "number", valueGetter: (p) => p?.row?.lead_value ?? "" },
      {
        field: "last_activity_at",
        headerName: "Last Activity",
        width: 180,
        valueGetter: (p) => {
          const date = p?.row?.last_activity_at;
          if (!date) return "";
          const d = new Date(date);
          return isNaN(d.getTime()) ? "" : d.toLocaleString();
        }
      },
      {
        field: "is_qualified",
        headerName: "Qualified",
        width: 120,
        type: "boolean",
        valueGetter: (p) => p?.row?.is_qualified ?? false
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 140,
        renderCell: (p) => (
          <div style={{ display: "flex", gap: 8 }}>
            <Link to={`/leads/${p?.row?._id}`}>Edit</Link>
            <button onClick={() => del(p?.row?._id)}>Delete</button>
          </div>
        )
      }
    ],
    []
  );

  async function fetchRows() {
    setLoading(true);

    const clean = cleanFilters(filters);
    const qp = new URLSearchParams({
      page: String(page + 1),
      limit: String(pageSize),
      ...clean
    });

    try {
      const res = await api(`/leads?${qp.toString()}`);
      setRows(res.data);
      setRowCount(res.total);
    } catch (e) {
      console.error("Error fetching leads:", e.message);
    } finally {
      setLoading(false);
    }
  }

  async function del(id) {
    if (!id) return;
    if (!confirm("Delete lead?")) return;
    await api(`/leads/${id}`, { method: "DELETE" });
    fetchRows();
  }

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  // Listen for new leads created from LeadForm
  useEffect(() => {
    const handler = (e) => setRows(prev => [e.detail, ...prev]);
    window.addEventListener("leadCreated", handler);
    return () => window.removeEventListener("leadCreated", handler);
  }, []);

  function applyFilters(e) {
    e.preventDefault();
    setPage(0);
    fetchRows();
  }

  return (
    <div>
      <form
        onSubmit={applyFilters}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 8,
          marginBottom: 12
        }}
      >
        <input
          placeholder="email contains"
          value={filters.email_contains}
          onChange={(e) => setFilters((f) => ({ ...f, email_contains: e.target.value }))}
        />
        <input
          placeholder="company contains"
          value={filters.company_contains}
          onChange={(e) => setFilters((f) => ({ ...f, company_contains: e.target.value }))}
        />
        <input
          placeholder="city contains"
          value={filters.city_contains}
          onChange={(e) => setFilters((f) => ({ ...f, city_contains: e.target.value }))}
        />
        <input
          placeholder="status_in (comma)"
          value={filters.status_in}
          onChange={(e) => setFilters((f) => ({ ...f, status_in: e.target.value }))}
        />
        <input
          placeholder="source_in (comma)"
          value={filters.source_in}
          onChange={(e) => setFilters((f) => ({ ...f, source_in: e.target.value }))}
        />
        <input
          placeholder="score_between (a,b)"
          value={filters.score_between}
          onChange={(e) => setFilters((f) => ({ ...f, score_between: e.target.value }))}
        />
        <input
          placeholder="value_between (a,b)"
          value={filters.lead_value_between}
          onChange={(e) => setFilters((f) => ({ ...f, lead_value_between: e.target.value }))}
        />
        <input
          placeholder="created_between (ISOa, ISOb)"
          value={filters.created_at_between}
          onChange={(e) => setFilters((f) => ({ ...f, created_at_between: e.target.value }))}
        />
        <input
          placeholder="lastAct_between (ISOa, ISOb)"
          value={filters.last_activity_at_between}
          onChange={(e) => setFilters((f) => ({ ...f, last_activity_at_between: e.target.value }))}
        />
        <select
          value={filters.is_qualified}
          onChange={(e) => setFilters((f) => ({ ...f, is_qualified: e.target.value }))}
        >
          <option value="">is_qualified?</option>
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
        <button type="submit">Apply</button>
      </form>

      <div style={{ height: 640, width: "100%" }}>
        <DataGrid
          rows={rows || []}
          columns={columns}
          loading={loading}
          getRowId={(r) => r?._id}
          paginationMode="server"
          rowCount={rowCount}
          page={page}
          onPageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          rowsPerPageOptions={[10, 20, 50, 100]}
        />
      </div>
    </div>
  );
}
