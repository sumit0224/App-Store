import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

/**
 * Wrap protected routes with <RequireAuth>
 * If not authenticated, redirects to /login and preserves the attempted location in state.
 */
const RequireAuth = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  if (auth.loading) {
    // Optionally return a spinner while auth state initializes
    return <div className="p-8">Loading...</div>;
  }

  if (!auth.isAuthenticated) {
    // Redirect to login, preserving the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
