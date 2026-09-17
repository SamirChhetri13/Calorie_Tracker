import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { HealthProvider } from "./context/HealthContext";

import ProtectedRoute from "./components/common/ProtectedRoute";
import Navbar from "./components/common/Navbar";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import LoggingPage from "./pages/LoggingPage";
import FoodDatabasePage from "./pages/FoodDatabasePage";
import RecommendationPage from "./pages/RecommendationPage";
import ProgressPage from "./pages/ProgressPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AdminPage from "./pages/AdminPage";

function AuthenticatedLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/logging" element={<LoggingPage />} />
          <Route path="/foods" element={<FoodDatabasePage />} />
          <Route path="/recommendations" element={<RecommendationPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <HealthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Onboarding Route */}
            <Route element={<ProtectedRoute />}>
              <Route path="/onboarding" element={<OnboardingPage />} />
            </Route>

            {/* App Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/*" element={<AuthenticatedLayout />} />
            </Route>
          </Routes>
        </HealthProvider>
      </AuthProvider>
    </Router>
  );
}
