
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StrictMode } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Calculadora from "./pages/Calculadora";
import Peticoes from "./pages/Peticoes";
import NotFound from "./pages/NotFound";
import MasterPasswordReset from "./components/auth/MasterPasswordReset";

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
              <Route path="/" element={<Login />} />
              <Route path="/calculadora" element={<Calculadora />} />
              <Route path="/peticoes" element={<Peticoes />} />
              <Route path="/reset-password" element={<MasterPasswordReset />} />
              {/* Redirecionar a página index antiga para o login */}
              <Route path="/index" element={<Navigate to="/" replace />} />
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
