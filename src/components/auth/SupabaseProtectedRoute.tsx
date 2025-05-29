
import React from 'react';
import { useSupabaseAuthOnly } from '@/hooks/auth/useSupabaseAuthOnly';
import { Navigate, useLocation } from 'react-router-dom';

interface SupabaseProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

const SupabaseProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  requireAdmin = false 
}: SupabaseProtectedRouteProps) => {
  const { user, profile, loading } = useSupabaseAuthOnly();
  const location = useLocation();

  console.log('SUPABASE_PROTECTED_ROUTE: Verificação de acesso:', {
    path: location.pathname,
    user: !!user,
    userId: user?.id,
    userEmail: user?.email,
    profile: !!profile,
    planId: profile?.plano_id,
    loading,
    requireAuth,
    requireAdmin,
    timestamp: new Date().toISOString()
  });

  // Show loading spinner while checking authentication
  if (loading) {
    console.log('SUPABASE_PROTECTED_ROUTE: Ainda carregando autenticação...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-juriscalc-blue via-juriscalc-navy to-juriscalc-gold">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg font-medium">Verificando autenticação...</p>
          <p className="text-sm opacity-75 mt-2">Aguarde um momento</p>
        </div>
      </div>
    );
  }

  // Only redirect to login if authentication is required and user is not authenticated
  if (requireAuth && !user) {
    console.log('SUPABASE_PROTECTED_ROUTE: Usuário não autenticado, redirecionando para /');
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Only redirect to home if admin access is required but user is not admin
  if (requireAdmin && user && profile?.plano_id !== 'admin') {
    console.log('SUPABASE_PROTECTED_ROUTE: Usuário não é admin, redirecionando para /home');
    return <Navigate to="/home" replace />;
  }

  console.log('SUPABASE_PROTECTED_ROUTE: Acesso permitido, renderizando conteúdo');
  return <>{children}</>;
};

export default SupabaseProtectedRoute;
