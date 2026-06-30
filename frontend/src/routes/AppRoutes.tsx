import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Login from "../pages/Auth/Login";
import Landing from "../pages/Landing/Landing";
import Dashboard from "../pages/Dashboard/Dashboard";
import AICoach from "../pages/AICoach/AICoach";
import Leaderboard from "../pages/Leaderboard/Leaderboard";
import MockInterview from "../pages/MockInterview/MockInterview";
import PublicProfile from "../pages/Profile/PublicProfile";
import { useAuthStore } from "../store/auth.store";
import { useEffect } from "react";
import LoadingSpinner from "../components/ui/LoadingSpinner";

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function AppRoutes() {
  const { checkAuth, isLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-dark-200">
        <LoadingSpinner label="Loading CodePulse..." />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />}
        />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />

        <Route path="/u/:username" element={<PublicProfile />} />

        <Route path="/" element={<DashboardLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="ai-coach" element={<AICoach />} />
          <Route path="mock-interview" element={<MockInterview />} />
          <Route path="leaderboard" element={<Leaderboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
