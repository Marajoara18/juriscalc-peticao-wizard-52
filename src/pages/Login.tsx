
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginFormData, RegisterFormData } from '@/types/auth';
import LoginContainer from '@/components/auth/LoginContainer';
import SubscriptionManager from '@/components/peticoes/SubscriptionManager';

const Login = () => {
  const { handleLogin, handleRegister } = useAuth();
  const [showSubscription, setShowSubscription] = useState(false);
  
  const onLogin = (data: LoginFormData) => {
    handleLogin(data);
  };
  
  const onRegister = (data: RegisterFormData) => {
    handleRegister(data);
  };
  
  return (
    <div className="login-container min-h-screen flex items-center justify-center bg-cover bg-center px-4 py-12" 
         style={{ backgroundImage: "url('/lovable-uploads/6ca45eaa-5e64-4059-919a-249b086b29ae.png')" }}>
      
      <LoginContainer 
        onLogin={onLogin}
        onRegister={onRegister}
        onSubscribe={() => setShowSubscription(true)}
      />
      
      {/* Subscription Dialog */}
      {showSubscription && (
        <SubscriptionManager onClose={() => setShowSubscription(false)} />
      )}
    </div>
  );
};

export default Login;
