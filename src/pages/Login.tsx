
import React, { useState } from 'react';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthLogo from '@/components/auth/AuthLogo';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/hooks/useAuth';
import { LoginFormData, RegisterFormData } from '@/types/auth';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Check, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import ManualRapido from '@/components/calculadora/ManualRapido';
import SubscriptionManager from '@/components/peticoes/SubscriptionManager';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
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
        
        {/* Premium Plan Button */}
        <div className="border-t border-gray-200 pt-6 mt-4">
          <div className="bg-gradient-to-r from-juriscalc-navy to-blue-800 p-4 rounded-lg text-white mb-4">
            <div className="flex items-center mb-2">
              <Star className="h-5 w-5 text-juriscalc-gold mr-2" />
              <h3 className="text-lg font-bold">Plano Premium</h3>
            </div>
            <p className="text-sm mb-3">
              Desbloqueie recursos avançados e aumente sua produtividade:
            </p>
            <ul className="text-sm space-y-1 mb-3">
              <li className="flex items-start">
                <Check className="h-4 w-4 text-juriscalc-gold mr-1 mt-0.5 flex-shrink-0" />
                <span>Cálculos ilimitados</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-juriscalc-gold mr-1 mt-0.5 flex-shrink-0" />
                <span>Acesso a todos os modelos de petições</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-juriscalc-gold mr-1 mt-0.5 flex-shrink-0" />
                <span>Suporte prioritário</span>
              </li>
            </ul>
            <Button 
              className="w-full bg-juriscalc-gold text-juriscalc-navy hover:bg-juriscalc-gold/90"
              onClick={() => setShowSubscription(true)}
            >
              <Star className="mr-2 h-4 w-4" />
              Assinar Premium
            </Button>
          </div>
        </div>
        
        {/* Manual Rápido Button */}
        <div className="flex justify-center">
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
      
      {/* Subscription Dialog */}
      {showSubscription && (
        <SubscriptionManager onClose={() => setShowSubscription(false)} />
      )}
    </div>
  );
};

export default Login;
