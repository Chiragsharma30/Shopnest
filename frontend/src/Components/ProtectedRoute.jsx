
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../Context/AuthContext";

function ProtectedRoute({ adminOnly = false }) {
  const { user } = useAuth();
  const location = useLocation();

  const token = localStorage.getItem("token");

  // Redirect users who are not logged in.
  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Only admin users can access admin routes.
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
