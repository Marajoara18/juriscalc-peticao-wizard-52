
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Calculator, Crown, User } from "lucide-react";
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import SubscriptionManager from '@/components/peticoes/SubscriptionManager';

const Header = () => {
  const navigate = useNavigate();
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [showSubscription, setShowSubscription] = useState(false);
  
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    
    // Verificar acesso premium diretamente do localStorage para garantir atualização em tempo real
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const currentUser = allUsers.find((u: any) => u.id === userId);
    
    // Se for admin ou tiver marcado como premium, considere-o premium
    if (currentUser && (currentUser.isAdmin || currentUser.isPremium)) {
      setIsPremium(true);
      return;
    }
    
    setIsPremium(false);
  }, []);
  
  const handleNewPeticao = () => {
    navigate('/peticoes');
  };
  
  const handleCalculadora = () => {
    navigate('/calculadora');
  };
  
  const handleUserClick = () => {
    // Navigate to the user account view in peticoes
    navigate('/peticoes', { state: { initialView: 'user' } });
  };
  
  return (
    <header className="bg-juriscalc-navy text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <div className="bg-white p-2 rounded-lg">
            <img 
              src="/lovable-uploads/caf683c7-0cb3-4ef4-8e5f-5de22f996b8a.png"
              alt="Logo"
              className="h-28 w-auto"
              style={{ minWidth: 180 }}
            />
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-juriscalc-gold transition-colors">Home</Link>
          <Link to="/calculadora" className="hover:text-juriscalc-gold transition-colors">Calculadora</Link>
          <Link to="/peticoes" className="hover:text-juriscalc-gold transition-colors">Petições</Link>
          {!isPremium && (
            <Button
              onClick={() => setShowSubscription(true)}
              className="bg-juriscalc-gold text-juriscalc-navy hover:bg-opacity-90 flex items-center gap-1"
            >
              <Crown className="h-4 w-4" />
              Premium
            </Button>
          )}
        </nav>
        <div className="flex items-center gap-2">
          <Button 
            className="bg-white text-juriscalc-navy hover:bg-gray-100"
            onClick={handleCalculadora}
          >
            <Calculator className="mr-2 h-4 w-4" />
            Calculadora
          </Button>
          <Button 
            className="bg-juriscalc-gold text-juriscalc-navy hover:bg-opacity-90"
            onClick={handleNewPeticao}
          >
            <FileText className="mr-2 h-4 w-4" />
            Nova Petição
          </Button>
          <Button 
            className="bg-white text-juriscalc-navy hover:bg-gray-100"
            onClick={handleUserClick}
          >
            <User className="mr-2 h-4 w-4" />
            Minha Conta
          </Button>
        </div>
      </div>
      
      {showSubscription && (
        <SubscriptionManager onClose={() => setShowSubscription(false)} />
      )}
    </header>
  );
};

export default Header;
