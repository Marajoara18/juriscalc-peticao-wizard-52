
import React, { useState } from 'react';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthLogo from '@/components/auth/AuthLogo';
import SupabaseLoginForm from './SupabaseLoginForm';
import SupabaseRegisterForm from './SupabaseRegisterForm';
import { Link } from 'react-router-dom';
import ManualRapidoButton from './ManualRapidoButton';
import SubscriptionManager from '@/components/peticoes/SubscriptionManager';

const SupabaseLoginContainer = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [showSubscription, setShowSubscription] = useState(false);
  
  return (
    <div className="max-w-md w-full space-y-8 bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-2xl">
      <AuthLogo />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="cadastro">Cadastro</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <SupabaseLoginForm />
          <div className="text-center mt-4">
            <Link to="/esqueci-senha" className="text-sm text-juriscalc-navy hover:underline">
              Esqueceu sua senha?
            </Link>
          </div>
        </TabsContent>
        
        <TabsContent value="cadastro">
          <SupabaseRegisterForm />
        </TabsContent>
      </Tabs>
      
      {/* Cartão Premium */}
      <div className="border-t border-gray-200 pt-6 mt-4">
        <div className="bg-gradient-to-r from-juriscalc-navy to-blue-800 p-5 rounded-lg text-white mb-4 shadow-lg">
          <div className="flex items-center mb-3">
            <img 
              src="/lovable-uploads/0eed6b8a-2bd0-4452-8bc3-d71051203a0a.png" 
              alt="Plano Premium" 
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>
      
      <ManualRapidoButton />
      
      {showSubscription && (
        <SubscriptionManager onClose={() => setShowSubscription(false)} />
      )}
    </div>
  );
};

export default SupabaseLoginContainer;
