
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import SubscriptionManager from './SubscriptionManager';
import { AlertCircle, TestTube, Crown } from 'lucide-react';
import { isUnlimitedTestMode } from '@/utils/testModeUtils';
import { useSupabaseAuth } from '@/hooks/auth/useSupabaseAuth';

const LIMITE_CALCULOS_GRATUITOS = 3;
const KEY_CONTADOR_CALCULOS = 'calculosRealizados';

const PremiumAlert = () => {
  const { user, profile } = useSupabaseAuth();
  const [showSubscription, setShowSubscription] = useState(false);
  const [calculosRestantes, setCalculosRestantes] = useState<number>(LIMITE_CALCULOS_GRATUITOS);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isTestMode, setIsTestMode] = useState<boolean>(false);
  const [premiumSource, setPremiumSource] = useState<'profile' | 'admin' | null>(null);
  
  useEffect(() => {
    // Verificar primeiro se está em modo de teste
    const testModeActive = isUnlimitedTestMode();
    setIsTestMode(testModeActive);
    
    if (testModeActive) {
      console.log('PREMIUM_ALERT: Test mode active - unlimited calculations');
      return;
    }

    if (!user) {
      console.log('PREMIUM_ALERT: No user authenticated');
      return;
    }

    const userId = user.id;
    
    // Verificar acesso premium via Supabase profile
    const isPremiumProfile = profile?.tipo_plano === 'premium' || profile?.tipo_usuario === 'admin_mestre';
    
    // Verificar acesso premium via localStorage (definido pelo admin)
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const currentUser = allUsers.find((u: any) => u.email === user.email);
    const isPremiumLocalStorage = currentUser?.isPremium || currentUser?.isAdmin;
    
    // Usuário tem premium se tiver via profile OU via localStorage
    const hasAnyPremium = isPremiumProfile || isPremiumLocalStorage;
    
    console.log('PREMIUM_ALERT: Premium access check:', {
      userId,
      userEmail: user.email,
      isPremiumProfile,
      isPremiumLocalStorage,
      hasAnyPremium,
      currentUser
    });
    
    if (hasAnyPremium) {
      setIsPremium(true);
      setPremiumSource(isPremiumProfile ? 'profile' : 'admin');
      localStorage.setItem('isPremium', 'true');
      return;
    }
    
    // Calcular cálculos restantes para usuários não premium
    const calculosKey = `${KEY_CONTADOR_CALCULOS}_${userId}`;
    const calculosRealizados = localStorage.getItem(calculosKey) 
      ? parseInt(localStorage.getItem(calculosKey) || '0', 10) 
      : 0;
    
    const restantes = Math.max(0, LIMITE_CALCULOS_GRATUITOS - calculosRealizados);
    setCalculosRestantes(restantes);
    setIsPremium(false);
    setPremiumSource(null);
    localStorage.setItem('isPremium', 'false');
  }, [user, profile]);
  
  // Se for premium ou modo de teste, mostrar indicador especial
  if (isPremium || isTestMode) {
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
    
    if (isPremium) {
      return (
        <div className="bg-gradient-to-r from-juriscalc-gold/10 to-yellow-50 border-l-4 border-juriscalc-gold p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <Crown className="h-5 w-5 text-juriscalc-gold" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-juriscalc-navy">
                👑 <strong>Acesso Premium Ativo:</strong> Você tem cálculos ilimitados disponíveis.
                {premiumSource === 'admin' && (
                  <span className="block text-xs text-gray-600 mt-1">
                    Acesso concedido pelo administrador
                  </span>
                )}
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
