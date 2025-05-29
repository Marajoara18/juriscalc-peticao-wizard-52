
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import SubscriptionManager from './SubscriptionManager';
import { AlertCircle } from 'lucide-react';
import { useSupabaseAuthOnly } from '@/hooks/auth/useSupabaseAuthOnly';
import { useSupabaseCalculationLimits } from '@/hooks/calculadora/useSupabaseCalculationLimits';

const SupabasePremiumAlert = () => {
  const { user, profile } = useSupabaseAuthOnly();
  const { calculosRealizados, calculosRestantes, limiteMaximo } = useSupabaseCalculationLimits();
  const [showSubscription, setShowSubscription] = useState(false);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  
  useEffect(() => {
    if (!user) {
      console.log('SUPABASE_PREMIUM_ALERT: No user authenticated');
      return;
    }

    // Verificar acesso premium via Supabase profile apenas
    const isPremiumProfile = profile?.plano_id === 'premium_mensal' || 
                            profile?.plano_id === 'premium_anual' || 
                            profile?.plano_id === 'admin';
    
    console.log('SUPABASE_PREMIUM_ALERT: Premium access check:', {
      userId: user.id,
      userEmail: user.email,
      isPremiumProfile,
      planId: profile?.plano_id,
      calculosRealizados,
      calculosRestantes
    });
    
    setIsPremium(isPremiumProfile);
  }, [user, profile, calculosRealizados]);
  
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
              {typeof calculosRestantes === 'number' && calculosRestantes > 0 ? (
                <>
                  Você está utilizando a versão gratuita. Restam <strong>{calculosRestantes}</strong> de {limiteMaximo} cálculos disponíveis.
                </>
              ) : (
                <>
                  Você atingiu o limite de <strong>{limiteMaximo}</strong> cálculos da versão gratuita.
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

export default SupabasePremiumAlert;
