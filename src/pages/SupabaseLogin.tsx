
import React from 'react';
import { useSupabaseAuth } from '@/hooks/auth/useSupabaseAuth';
import { Navigate } from 'react-router-dom';
import SupabaseLoginContainer from '@/components/auth/SupabaseLoginContainer';

const SupabaseLogin = () => {
  const { user, loading } = useSupabaseAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-juriscalc-navy"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="login-container min-h-screen flex items-center justify-center bg-cover bg-center px-4 py-12" 
         style={{ backgroundImage: "url('/lovable-uploads/6ca45eaa-5e64-4059-919a-249b086b29ae.png')" }}>
      <SupabaseLoginContainer />
    </div>
  );
};

export default SupabaseLogin;
