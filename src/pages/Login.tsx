
import React, { useState } from 'react';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthLogo from '@/components/auth/AuthLogo';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/hooks/useAuth';
import { LoginFormData, RegisterFormData } from '@/types/auth';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const { handleLogin, handleRegister } = useAuth();
  
  const onLogin = (data: LoginFormData) => {
    handleLogin(data);
  };
  
  const onRegister = (data: RegisterFormData) => {
    handleRegister(data);
  };
  
  return (
    <div className="login-container min-h-screen flex items-center justify-center bg-cover bg-center px-4 py-12" 
         style={{ backgroundImage: "url('/lovable-uploads/6ca45eaa-5e64-4059-919a-249b086b29ae.png')" }}>
      <div className="max-w-md w-full space-y-8 bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl">
        <AuthLogo />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="cadastro">Cadastro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm onSubmit={onLogin} />
          </TabsContent>
          
          <TabsContent value="cadastro">
            <RegisterForm onSubmit={onRegister} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
