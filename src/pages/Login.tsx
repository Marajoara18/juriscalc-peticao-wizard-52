
import React, { useState } from 'react';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthLogo from '@/components/auth/AuthLogo';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/hooks/useAuth';
import { LoginFormData, RegisterFormData } from '@/types/auth';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import ManualRapido from '@/components/calculadora/ManualRapido';

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
        
        {/* Manual Rápido Button */}
        <div className="flex justify-center mt-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                className="border-juriscalc-navy text-juriscalc-navy hover:bg-gray-100"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Manual Rápido IusCalc
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <ManualRapido />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Login;
