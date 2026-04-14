import * as React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import SmartTodos from "@/pages/SmartTodos";
import SmartTodoForm from "@/pages/SmartTodoForm";
import { useAuth } from "@/hooks/useAuth";

function FullScreenLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function App() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) return <FullScreenLoader />;

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={user ? <Navigate to="/" replace /> : <Auth />} />

      <Route path="/" element={user ? <Index /> : <Navigate to="/auth" replace />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" replace />} />
      <Route path="/profile" element={user ? <Profile /> : <Navigate to="/auth" replace />} />
      <Route path="/smart-todos" element={user ? <SmartTodos /> : <Navigate to="/auth" replace />} />
      <Route path="/smart-todos/new" element={user ? <SmartTodoForm /> : <Navigate to="/auth" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
