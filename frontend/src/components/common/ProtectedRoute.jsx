import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user, loading, hasProfile } = useAuth();

  if (loading) {
    return <LoadingSpinner label="Verifying security credentials..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Redirect user to onboarding if biometrics haven't been completed yet!
  if (!user?.hasCompletedOnboarding && !hasProfile && window.location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
