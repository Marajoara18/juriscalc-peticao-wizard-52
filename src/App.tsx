
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StrictMode } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SupabaseLogin from "./pages/SupabaseLogin";
import AdminPanel from "./pages/AdminPanel";
import Calculadora from "./pages/Calculadora";
import Peticoes from "./pages/Peticoes";
import NotFound from "./pages/NotFound";
import SupabaseProtectedRoute from "./components/auth/SupabaseProtectedRoute";
import MasterPasswordReset from "./components/auth/MasterPasswordReset";
import PasswordResetRequest from "./components/auth/PasswordResetRequest";
import PasswordReset from "./components/auth/PasswordReset";

const App = () => {
  // Create a client inside the component function
  const queryClient = new QueryClient();
  
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<SupabaseLogin />} />
              <Route path="/login-old" element={<Login />} />
              <Route path="/esqueci-senha" element={<PasswordResetRequest />} />
              <Route path="/reset-senha" element={<PasswordReset />} />
              <Route path="/reset-password" element={<MasterPasswordReset />} />
              
              {/* Protected routes - require authentication */}
              <Route 
                path="/home" 
                element={
                  <SupabaseProtectedRoute requireAuth={true}>
                    <Index />
                  </SupabaseProtectedRoute>
                } 
              />
              <Route 
                path="/calculadora" 
                element={
                  <SupabaseProtectedRoute requireAuth={true}>
                    <Calculadora />
                  </SupabaseProtectedRoute>
                } 
              />
              <Route 
                path="/peticoes" 
                element={
                  <SupabaseProtectedRoute requireAuth={true}>
                    <Peticoes />
                  </SupabaseProtectedRoute>
                } 
              />
              
              {/* Rota dedicada para Minha Conta */}
              <Route 
                path="/minha-conta" 
                element={
                  <SupabaseProtectedRoute requireAuth={true}>
                    <Peticoes />
                  </SupabaseProtectedRoute>
                } 
              />
              
              {/* Admin routes - require authentication and admin role */}
              <Route 
                path="/admin" 
                element={
                  <SupabaseProtectedRoute requireAuth={true} requireAdmin={true}>
                    <AdminPanel />
                  </SupabaseProtectedRoute>
                } 
              />
              
              {/* Redirects for common paths */}
              <Route path="/index" element={<Navigate to="/home" replace />} />
              
              {/* Catch all other routes - must be last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </StrictMode>
  );
};

export default App;
