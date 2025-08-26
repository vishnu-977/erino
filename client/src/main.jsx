import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App.jsx";
import LoginRegister from "./pages/LoginRegister.jsx";
import Leads from "./pages/Leads.jsx";
import LeadForm from "./pages/LeadForm.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route element={<App />}>
        <Route index element={<Navigate to="/leads" />} />
        <Route path="/auth" element={<LoginRegister />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/leads" element={<Leads />} />
          <Route path="/leads/new" element={<LeadForm />} />
          <Route path="/leads/:id" element={<LeadForm />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);
