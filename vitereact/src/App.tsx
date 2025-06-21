import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import Global Shared Views that exist
import GV_GlobalSidebar from "@/components/views/GV_GlobalSidebar.tsx";
import GV_GlobalFooter from "@/components/views/GV_GlobalFooter.tsx";
import GV_GlobalNotifications from "@/components/views/GV_GlobalNotifications.tsx";

// Import Lazy-Loaded Views that exist
const UV_Landing = lazy(() => import("@/components/views/UV_Landing.tsx"));
const UV_Dashboard = lazy(() => import("@/components/views/UV_Dashboard.tsx"));
const UV_TaskListView = lazy(() => import("@/components/views/UV_TaskListView.tsx"));
const UV_TaskDetailsView = lazy(() => import("@/components/views/UV_TaskDetailsView.tsx"));
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

  const handleLogout = () => {
    useAppStore.getState().logout();
    navigate("/");
  };

  // Simple login component
  const SimpleLogin = () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-2xl font-bold">Login</h2>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => {
            useAppStore.getState().login("demo-token", "user123", "admin");
            navigate("/dashboard");
          }}
        >
          Demo Login
        </button>
      </div>
    </div>
  );

  // Simple top navigation component
  const TopNav = ({ isAuthenticated, onLogout }: { isAuthenticated: boolean; onLogout: () => void }) => (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Task Management</h1>
        {isAuthenticated && (
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-blue-700 rounded hover:bg-blue-800"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>
        {auth?.token && <GV_GlobalSidebar />}

        <div className="min-h-screen bg-gray-100">
          <TopNav
            isAuthenticated={Boolean(auth?.token)}
            onLogout={handleLogout}
          />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Outlet />}>
              <Route index element={<UV_Landing />} />
              <Route path="login" element={<SimpleLogin />} />
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

export default App;