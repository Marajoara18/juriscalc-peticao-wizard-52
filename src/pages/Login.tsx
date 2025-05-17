
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8">
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
