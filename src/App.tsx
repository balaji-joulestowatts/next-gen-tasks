import * as React from "react";
import { Routes, Route } from "react-router-dom";

import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import SmartTodos from "@/pages/SmartTodos";
import SmartTodoForm from "@/pages/SmartTodoForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/smart-todos" element={<SmartTodos />} />
      <Route path="/smart-todos/new" element={<SmartTodoForm />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
