
import React from 'react';
import SupabaseLoginContainer from '@/components/auth/SupabaseLoginContainer';

const SupabaseLogin = () => {
  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-juriscalc-blue via-juriscalc-navy to-juriscalc-gold flex items-center justify-center p-4"
      style={{ 
        backgroundImage: "url('/lovable-uploads/22902ab3-f207-4d33-9503-0fb6e29d3d05.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="w-full max-w-md">
        <SupabaseLoginContainer />
      </div>
    </div>
  );
};

export default SupabaseLogin;
