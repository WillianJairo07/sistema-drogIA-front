import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { hasPermission } from "../../features/auth/config/permissions";

export default function ProtectedRoute({ children, path }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (path && !hasPermission(user.role, path)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}