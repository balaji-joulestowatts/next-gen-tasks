import * as React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import SmartTodos from "@/pages/SmartTodos";
import SmartTodoForm from "@/pages/SmartTodoForm";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/smart-todos" element={<SmartTodos />} />
        <Route path="/smart-todos/new" element={<SmartTodoForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
