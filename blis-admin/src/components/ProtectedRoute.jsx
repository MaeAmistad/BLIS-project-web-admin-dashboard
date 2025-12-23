import { Navigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
