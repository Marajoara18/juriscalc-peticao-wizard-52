
import React, { useState } from 'react';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthLogo from '@/components/auth/AuthLogo';
import SupabaseLoginForm from './SupabaseLoginForm';
import SupabaseRegisterForm from './SupabaseRegisterForm';
import { Link } from 'react-router-dom';
import PremiumPlanCard from './PremiumPlanCard';
import ManualRapidoButton from './ManualRapidoButton';

const SupabaseLoginContainer = () => {
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
      
      <ManualRapidoButton />
    </div>
  );
};

export default SupabaseLoginContainer;
