
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import SubscriptionManager from './SubscriptionManager';
import { AlertCircle } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/auth/useSupabaseAuth';

const LIMITE_CALCULOS_GRATUITOS = 3;
const KEY_CONTADOR_CALCULOS = 'calculosRealizados';

const PremiumAlert = () => {
  const { user, profile } = useSupabaseAuth();
  const [showSubscription, setShowSubscription] = useState(false);
  const [calculosRestantes, setCalculosRestantes] = useState<number>(LIMITE_CALCULOS_GRATUITOS);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  
  useEffect(() => {
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
    localStorage.setItem('isPremium', 'false');
  }, [user, profile]);
  
  // Se for premium, não mostrar nenhum alerta
  if (isPremium) {
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
