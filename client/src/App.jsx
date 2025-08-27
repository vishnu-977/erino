import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Leads from "./pages/Leads";
import LeadForm from "./pages/LeadForm";
import LoginRegister from "./pages/LoginRegister";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<LoginRegister />} />
        <Route path="/" element={<App />}>
          <Route index element={<Leads />} />
          <Route path="leads" element={<Leads />} />
          <Route
            path="leads/new"
            element={<LeadForm onLeadCreated={(newLead) => window.dispatchEvent(new CustomEvent("leadCreated", { detail: newLead }))} />}
          />
          <Route path="leads/:id" element={<LeadForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
