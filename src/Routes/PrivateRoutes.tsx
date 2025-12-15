import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PrivateRoutes() {
  const auth = useContext(AuthContext);
  const location = useLocation();

  if (!auth) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (auth.loading) {
    return <div style={{ padding: 16 }}>Carregando...</div>;
  }

  if (!auth.user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
