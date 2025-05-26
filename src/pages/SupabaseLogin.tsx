
import React from 'react';
import SupabaseLoginContainer from '@/components/auth/SupabaseLoginContainer';

const SupabaseLogin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-juriscalc-blue via-juriscalc-navy to-juriscalc-gold flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SupabaseLoginContainer />
      </div>
    </div>
  );
};

export default SupabaseLogin;
