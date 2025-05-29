
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuthOnly } from '@/hooks/auth/useSupabaseAuthOnly';

const LIMITE_CALCULOS_GRATUITOS = 3;

export const useSupabaseCalculationLimits = () => {
  const { user, profile } = useSupabaseAuthOnly();
  
  const [podeCalcular, setPodeCalcular] = useState<boolean>(true);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState<boolean>(false);
  const [calculosRealizados, setCalculosRealizados] = useState<number>(0);

  // Verificar número de cálculos salvos do usuário no Supabase
  useEffect(() => {
    if (!user) {
      console.log('SUPABASE_CALCULATION_LIMITS: No user authenticated');
      setPodeCalcular(false);
      setCalculosRealizados(0);
      return;
    }

    const fetchCalculosCount = async () => {
      try {
        console.log('SUPABASE_CALCULATION_LIMITS: Contando cálculos para usuário:', user.id);
        
        const { count, error } = await supabase
          .from('calculos_salvos')
          .select('*', { count: 'exact', head: true })
          .eq('usuario_id', user.id);

        if (error) {
          console.error('SUPABASE_CALCULATION_LIMITS: Erro ao contar cálculos:', error);
          return;
        }

        const calculosCount = count || 0;
        setCalculosRealizados(calculosCount);

        // Verificar se o usuário é premium
        const isPremium = profile?.plano_id?.includes('premium') || profile?.plano_id === 'admin';
        
        console.log('SUPABASE_CALCULATION_LIMITS: Cálculos salvos:', {
          userId: user.id,
          userEmail: user.email,
          calculosCount,
          isPremium,
          limite: LIMITE_CALCULOS_GRATUITOS,
          planId: profile?.plano_id
        });
        
        // Para usuários premium, sempre permitir salvar
        if (isPremium) {
          console.log('SUPABASE_CALCULATION_LIMITS: Premium user - unlimited calculations');
          setPodeCalcular(true);
          return;
        }
        
        // Para usuários não premium, verificar limite
        const podeCalcularNovo = calculosCount < LIMITE_CALCULOS_GRATUITOS;
        console.log('SUPABASE_CALCULATION_LIMITS: Setting podeCalcular to:', podeCalcularNovo, 
          `(${calculosCount}/${LIMITE_CALCULOS_GRATUITOS} used)`);
        setPodeCalcular(podeCalcularNovo);
        
      } catch (error) {
        console.error('SUPABASE_CALCULATION_LIMITS: Erro inesperado:', error);
      }
    };

    fetchCalculosCount();
  }, [user, profile]);

  // Função para verificar se pode salvar antes de tentar salvar
  const verificarLimiteSalvamento = () => {
    if (!user) {
      console.error('SUPABASE_CALCULATION_LIMITS: No user authenticated');
      toast.error('Você precisa estar logado para salvar cálculos');
      return false;
    }

    // Verificar se o usuário é premium
    const isPremium = profile?.plano_id?.includes('premium') || profile?.plano_id === 'admin';
    
    console.log('SUPABASE_CALCULATION_LIMITS: Checking save limits:', { 
      userId: user.id, 
      userEmail: user.email,
      calculosRealizados,
      isPremium,
      planId: profile?.plano_id,
      limite: LIMITE_CALCULOS_GRATUITOS
    });
    
    // Para usuários premium, não há limitação
    if (isPremium) {
      console.log('SUPABASE_CALCULATION_LIMITS: Premium user - can save calculation');
      return true;
    }
    
    // Para usuários não premium, verificar limite
    if (calculosRealizados >= LIMITE_CALCULOS_GRATUITOS) {
      console.log('SUPABASE_CALCULATION_LIMITS: Save limit reached - showing subscription modal');
      toast.error(`Você atingiu o limite de ${LIMITE_CALCULOS_GRATUITOS} cálculos salvos. Assine o plano premium para continuar.`);
      setShowSubscriptionModal(true);
      return false;
    }
    
    console.log('SUPABASE_CALCULATION_LIMITS: Can save calculation:', 
      `(${calculosRealizados + 1}/${LIMITE_CALCULOS_GRATUITOS})`);
    return true;
  };

  const getCalculosRestantes = () => {
    const isPremium = profile?.plano_id?.includes('premium') || profile?.plano_id === 'admin';
    
    if (isPremium) {
      return 'Ilimitado';
    }
    
    return Math.max(0, LIMITE_CALCULOS_GRATUITOS - calculosRealizados);
  };

  return {
    podeCalcular,
    showSubscriptionModal,
    setShowSubscriptionModal,
    verificarLimiteSalvamento,
    calculosRealizados,
    calculosRestantes: getCalculosRestantes(),
    limiteMaximo: LIMITE_CALCULOS_GRATUITOS
  };
};
