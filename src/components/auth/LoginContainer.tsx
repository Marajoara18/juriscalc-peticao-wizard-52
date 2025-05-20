
import React, { useState } from 'react';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthLogo from '@/components/auth/AuthLogo';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { Link } from 'react-router-dom';
import PremiumPlanCard from './PremiumPlanCard';
import ManualRapidoButton from './ManualRapidoButton';
import { LoginFormData, RegisterFormData } from '@/types/auth';

interface LoginContainerProps {
  onLogin: (data: LoginFormData) => void;
  onRegister: (data: RegisterFormData) => void;
  onSubscribe: () => void;
}

const LoginContainer: React.FC<LoginContainerProps> = ({ onLogin, onRegister, onSubscribe }) => {
  const [activeTab, setActiveTab] = useState('login');
  
  return (
    <div className="max-w-md w-full space-y-8 bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-2xl">
      <AuthLogo />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="cadastro">Cadastro</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <LoginForm onSubmit={onLogin} />
          <div className="text-center mt-4">
            <Link to="/esqueci-senha" className="text-sm text-juriscalc-navy hover:underline">
              Esqueceu sua senha?
            </Link>
          </div>
        </TabsContent>
        
        <TabsContent value="cadastro">
          <RegisterForm onSubmit={onRegister} />
        </TabsContent>
      </Tabs>
      
      <PremiumPlanCard onSubscribe={onSubscribe} />
      
      <ManualRapidoButton />
    </div>
  );
};

export default LoginContainer;
