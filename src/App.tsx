import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StrictMode } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SupabaseLogin from "./pages/SupabaseLogin";
import AdminPage from "./pages/AdminPage";
import Calculadora from "./pages/Calculadora";
import Peticoes from "./pages/Peticoes";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MasterPasswordReset from "./components/auth/MasterPasswordReset";
import PasswordResetRequest from "./components/auth/PasswordResetRequest";
import PasswordReset from "./components/auth/PasswordReset";
import AdminPanel from "./pages/AdminPanel";

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
              <Route path="/" element={<SupabaseLogin />} />
              <Route path="/login-old" element={<Login />} />
              <Route 
                path="/home" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <Index />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/calculadora" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <Calculadora />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/peticoes" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <Peticoes />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <AdminPanel />
                  </ProtectedRoute>
                } 
              />
              <Route path="/reset-password" element={<MasterPasswordReset />} />
              {/* Novas rotas para redefinição de senha */}
              <Route path="/esqueci-senha" element={<PasswordResetRequest />} />
              <Route path="/reset-senha" element={<PasswordReset />} />
              {/* Redirecionar a página index antiga para o login */}
              <Route path="/index" element={<Navigate to="/home" replace />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </StrictMode>
  );
};

export default App;
