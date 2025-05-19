
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import SubscriptionManager from './SubscriptionManager';
import { AlertCircle } from 'lucide-react';

const LIMITE_CALCULOS_GRATUITOS = 3;
const KEY_CONTADOR_CALCULOS = 'calculosRealizados';

const PremiumAlert = () => {
  const [showSubscription, setShowSubscription] = useState(false);
  const [calculosRestantes, setCalculosRestantes] = useState<number>(LIMITE_CALCULOS_GRATUITOS);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    
    // Verificar acesso premium diretamente do localStorage
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const currentUser = allUsers.find((u: any) => u.id === userId);
    
    // Se for admin ou tiver marcado como premium, considere-o premium
    if (currentUser && (currentUser.isAdmin || currentUser.isPremium)) {
      setIsPremium(true);
      return;
    }
    
    // Calcular cálculos restantes
    const calculosKey = `${KEY_CONTADOR_CALCULOS}_${userId}`;
    const calculosRealizados = localStorage.getItem(calculosKey) 
      ? parseInt(localStorage.getItem(calculosKey) || '0', 10) 
      : 0;
    
    const restantes = Math.max(0, LIMITE_CALCULOS_GRATUITOS - calculosRealizados);
    setCalculosRestantes(restantes);
    setIsPremium(false);
  }, []);
  
  // Se for premium, não exibir alerta
  if (isPremium) return null;
  
  return (
    <>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              {calculosRestantes > 0 ? (
                <>
                  Você está utilizando a versão gratuita. Restam <strong>{calculosRestantes}</strong> de {LIMITE_CALCULOS_GRATUITOS} cálculos disponíveis.
                </>
              ) : (
                <>
                  Você atingiu o limite de <strong>{LIMITE_CALCULOS_GRATUITOS}</strong> cálculos da versão gratuita.
                </>
              )}
              <Button 
                variant="link" 
                className="ml-1 p-0 text-yellow-700 font-medium underline"
                onClick={() => setShowSubscription(true)}
              >
                Assine o plano premium
              </Button>
            </p>
          </div>
        </div>
      </div>
      
      {showSubscription && (
        <SubscriptionManager onClose={() => setShowSubscription(false)} />
      )}
    </>
  );
};

export default PremiumAlert;
