
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

  console.log('PROTECTED_ROUTE: Auth check:', {
    user: !!user,
    profile: !!profile,
    loading,
    requireAuth,
    requireAdmin,
    currentPath: location.pathname
  });

  // Show loading spinner while checking authentication
  if (loading) {
    console.log('PROTECTED_ROUTE: Still loading, showing spinner');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-juriscalc-blue via-juriscalc-navy to-juriscalc-gold">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  // Redirect to login if authentication is required but user is not authenticated
  if (requireAuth && !user) {
    console.log('PROTECTED_ROUTE: User not authenticated, redirecting to login');
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Redirect to home if admin access is required but user is not admin
  if (requireAdmin && profile?.tipo_usuario !== 'admin_mestre') {
    console.log('PROTECTED_ROUTE: User not admin, redirecting to home');
    return <Navigate to="/home" replace />;
  }

  // If user is authenticated but profile is still loading, show a brief loading
  if (requireAuth && user && !profile) {
    console.log('PROTECTED_ROUTE: User authenticated but profile loading');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-juriscalc-blue via-juriscalc-navy to-juriscalc-gold">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p>Carregando perfil...</p>
        </div>
      </div>
    );
  }

  console.log('PROTECTED_ROUTE: All checks passed, rendering children');
  // If all checks pass, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
