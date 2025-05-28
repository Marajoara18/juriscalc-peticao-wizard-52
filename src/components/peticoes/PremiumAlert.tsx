
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import SubscriptionManager from './SubscriptionManager';
import { AlertCircle, TestTube } from 'lucide-react';
import { isUnlimitedTestMode } from '@/utils/testModeUtils';

const LIMITE_CALCULOS_GRATUITOS = 3;
const KEY_CONTADOR_CALCULOS = 'calculosRealizados';

const PremiumAlert = () => {
  const [showSubscription, setShowSubscription] = useState(false);
  const [calculosRestantes, setCalculosRestantes] = useState<number>(LIMITE_CALCULOS_GRATUITOS);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isTestMode, setIsTestMode] = useState<boolean>(false);
  
  useEffect(() => {
    // Verificar primeiro se está em modo de teste
    const testModeActive = isUnlimitedTestMode();
    setIsTestMode(testModeActive);
    
    if (testModeActive) {
      console.log('PREMIUM_ALERT: Test mode active - unlimited calculations');
      return;
    }

    const userId = localStorage.getItem('userId');
    
    // Verificar acesso premium diretamente do localStorage
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const currentUser = allUsers.find((u: any) => u.id === userId);
    
    // Se for admin ou tiver marcado como premium, considere-o premium
    if (currentUser && (currentUser.isAdmin || currentUser.isPremium)) {
      setIsPremium(true);
      localStorage.setItem('isPremium', 'true');
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
    localStorage.setItem('isPremium', 'false');
  }, []);
  
  // Se for premium ou modo de teste, não exibir alerta
  if (isPremium || isTestMode) {
    // Se for modo de teste, mostrar indicador especial
    if (isTestMode) {
      return (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <TestTube className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                🧪 <strong>Modo de Teste Ativo:</strong> Você tem acesso ilimitado a cálculos para teste.
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
  
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
