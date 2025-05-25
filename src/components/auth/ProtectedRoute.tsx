
import React from 'react';
import { useSupabaseAuth } from '@/hooks/auth/useSupabaseAuth';
import { Navigate } from 'react-router-dom';

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-juriscalc-navy"></div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && profile?.tipo_usuario !== 'admin_mestre') {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
