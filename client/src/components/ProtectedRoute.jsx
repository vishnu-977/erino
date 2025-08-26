import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function ProtectedRoute() {
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const me = await api("/auth/me");
      if (!me) return navigate("/auth");
      localStorage.setItem("me", JSON.stringify(me));
      setReady(true);
    })();
  }, []);
  if (!ready) return <p>Loading...</p>;
  return <Outlet />;
}
