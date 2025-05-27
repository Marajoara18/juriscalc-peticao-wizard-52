
import React from 'react';
import { useSupabaseAuth } from '@/hooks/auth/useSupabaseAuth';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  requireAdmin = false 
}: ProtectedRouteProps) => {
  const { user, profile, loading } = useSupabaseAuth();
  const location = useLocation();

  console.log('PROTECTED_ROUTE: Verificação de autenticação iniciada:', {
    user: !!user,
    userId: user?.id,
    userEmail: user?.email,
    profile: !!profile,
    profileType: profile?.tipo_usuario,
    loading,
    requireAuth,
    requireAdmin,
    currentPath: location.pathname,
    timestamp: new Date().toISOString()
  });

  // Show loading spinner while checking authentication
  if (loading) {
    console.log('PROTECTED_ROUTE: Ainda carregando autenticação, mostrando spinner');
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

  // Redirect to login if authentication is required but user is not authenticated
  if (requireAuth && !user) {
    console.log('PROTECTED_ROUTE: Usuário não autenticado, redirecionando para login:', {
      from: location.pathname,
      reason: 'user_not_authenticated'
    });
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If user is authenticated but profile is still loading, show brief loading
  if (requireAuth && user && !profile) {
    console.log('PROTECTED_ROUTE: Usuário autenticado mas perfil ainda carregando:', {
      userId: user.id,
      email: user.email
    });
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-juriscalc-blue via-juriscalc-navy to-juriscalc-gold">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg font-medium">Carregando perfil do usuário...</p>
        </div>
      </div>
    );
  }

  // Redirect to home if admin access is required but user is not admin
  if (requireAdmin && profile?.tipo_usuario !== 'admin_mestre') {
    console.log('PROTECTED_ROUTE: Usuário não é admin, redirecionando para home:', {
      userType: profile?.tipo_usuario,
      required: 'admin_mestre'
    });
    return <Navigate to="/home" replace />;
  }

  console.log('PROTECTED_ROUTE: Todas as verificações passaram, renderizando conteúdo:', {
    userId: user?.id,
    userEmail: user?.email,
    profileType: profile?.tipo_usuario,
    destinationPath: location.pathname,
    accessGranted: true
  });

  // If all checks pass, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
