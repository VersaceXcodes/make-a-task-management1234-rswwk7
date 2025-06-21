import React, { ErrorBoundary, lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RecoilRoot } from "recoil";

// Import Global Shared Views
import GV_TopNav from "@/components/views/GV_TopNav.tsx";
import GV_GlobalSidebar from "@/components/views/GV_GlobalSidebar.tsx";
import GV_GlobalFooter from "@/components/views/GV_GlobalFooter.tsx";
import GV_GlobalNotifications from "@/components/views/GV_GlobalNotifications.tsx";

// Import Lazy-Loaded Views
const UV_Landing = lazy(() => import("@/components/views/UV_Landing.tsx"));
const UV_Login = lazy(() => import("@/components/views/UV_Login.tsx"));
const UV_SignUp = lazy(() => import("@/components/views/UV_SignUp.tsx"));
const UV_Dashboard = lazy(() => import("@/components/views/UV_Dashboard.tsx"));
const UV_TaskListView = lazy(() => import("@/components/views/UV_TaskListView.tsx"));
const UV_TaskDetailsView = lazy(() => import("@/components/views/UV_TaskDetailsView.tsx"));
const UV_ProjectView = lazy(() => import("@/components/views/UV_ProjectView.tsx"));
const UV_ReportsView = lazy(() => import("@/components/views/UV_ReportsView.tsx"));
const UV_RecurringTaskSettingsView = lazy(() => import("@/components/views/UV_RecurringTaskSettingsView.tsx"));
const UV_KanbanView = lazy(() => import("@/components/views/UV_KanbanView.tsx"));

// Import Zustand Store
import { useAppStore } from "@/store/main";

// Initialize Query Client
const queryClient = new QueryClient();
const persistor: Persistor = new Persistor({ storage: localStorage });

const App: React.FC = () => {
  const navigate = useNavigate();
  const { auth, userPreferences } = useAppStore();

  useEffect(() => {
    // Check and hydrate auth state from local storage
    const token = localStorage.getItem("authToken");
    if (token) {
      useAppStore.setState({ auth: { token, userId: "user123", role: "admin" } });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>
        {auth?.token && <GV_GlobalSidebar />}

        <div className="min-h-screen bg-gray-100">
          <GV_TopNav
            isAuthenticated={Boolean(auth?.token)}
            onLogout={() => {
              useAppStore.setState({ auth: null });
              localStorage.removeItem("authToken");
              navigate("/login");
            }}
          />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Outlet />}>
              <Route index element={<UV_Landing />} />
              <Route path="login" element={<UV_Login />} />
              <Route path="register" element={<UV_SignUp />} />
            </Route>

            {/* Authenticated Routes */}
            <Route
              path="/dashboard"
              element={
                auth?.token ? (
                  <UV_Dashboard />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/tasks"
              element={
                auth ? (
                  <UV_TaskListView />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/tasks/:task_id"
              element={
                auth ? (
                  <UV_TaskDetailsView />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/projects"
              element={
                auth ? (
                  <UV_ProjectView />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/projects/:project_id"
              element={
                auth ? (
                  <UV_ProjectView />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/reports"
              element={
                auth ? (
                  <UV_ReportsView />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/settings/recurring"
              element={
                auth ? (
                  <UV_RecurringTaskSettingsView />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/kanban"
              element={
                auth ? (
                  <UV_KanbanView />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Fallback Route */}
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>

          <GV_GlobalNotifications />
          <GV_GlobalFooter />
        </div>
      </Suspense>
    </QueryClientProvider>
  );
};

// Wrap App with an Error Boundary
class AppErrorBoundary extends ErrorBoundary {
  render() {
    return <App />;
  }

  componentDidCatch(error: Error) {
    console.error("Application Error:", error);
  }
}

export default AppErrorBoundary;