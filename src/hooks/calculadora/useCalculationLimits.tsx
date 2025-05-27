
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { useSupabaseAuth } from '@/hooks/auth/useSupabaseAuth';

const LIMITE_CALCULOS_GRATUITOS = 3; // Confirmando o limite correto de 3 cálculos
const KEY_CONTADOR_CALCULOS = 'calculosRealizados';

export const useCalculationLimits = () => {
  const { user, profile } = useSupabaseAuth();
  
  // Estado para controlar se o usuário pode realizar mais cálculos
  const [podeCalcular, setPodeCalcular] = useState<boolean>(true);
  
  // Estado para controlar a modal de assinatura
  const [showSubscriptionModal, setShowSubscriptionModal] = useState<boolean>(false);
  
  // Verificar número de cálculos realizados pelo usuário
  useEffect(() => {
    if (!user) {
      console.log('useCalculationLimits: No user authenticated');
      setPodeCalcular(false);
      return;
    }

    const userId = user.id;
    
    // Verificar o contador de cálculos do usuário atual
    const calculosKey = `${KEY_CONTADOR_CALCULOS}_${userId}`;
    const calculosRealizados = localStorage.getItem(calculosKey) 
      ? parseInt(localStorage.getItem(calculosKey) || '0', 10) 
      : 0;
    
    // Verificar se o usuário é premium
    const isPremium = profile?.tipo_plano === 'premium' || profile?.tipo_usuario === 'admin_mestre';
    
    console.log('useCalculationLimits: Calculation limits check:', {
      userId,
      calculosRealizados,
      isPremium,
      limite: LIMITE_CALCULOS_GRATUITOS,
      userType: profile?.tipo_usuario,
      planType: profile?.tipo_plano
    });
    
    // Para usuários premium, sempre permitir calcular
    if (isPremium) {
      console.log('useCalculationLimits: Premium user - unlimited calculations');
      setPodeCalcular(true);
      return;
    }
    
    // Para usuários não premium, verificar limite de cálculos
    const podeCalcularNovo = calculosRealizados < LIMITE_CALCULOS_GRATUITOS;
    console.log('useCalculationLimits: Setting podeCalcular to:', podeCalcularNovo);
    setPodeCalcular(podeCalcularNovo);
  }, [user, profile]);

  // Função para verificar e incrementar contador de cálculos
  const verificarLimiteCalculos = (originalCalc: () => void) => {
    if (!user) {
      console.error('verificarLimiteCalculos: No user authenticated');
      toast.error('Você precisa estar logado para realizar cálculos');
      return;
    }

    const userId = user.id;
    const isPremium = profile?.tipo_plano === 'premium' || profile?.tipo_usuario === 'admin_mestre';
    
    console.log('verificarLimiteCalculos: Checking calculation limits:', { userId, isPremium });
    
    // Para usuários premium, não há limitação
    if (isPremium) {
      console.log('verificarLimiteCalculos: Premium user - executing calculation without limits');
      return originalCalc();
    }
    
    // Para usuários não premium, verificar e incrementar contador
    const calculosKey = `${KEY_CONTADOR_CALCULOS}_${userId}`;
    const calculosRealizados = localStorage.getItem(calculosKey) 
      ? parseInt(localStorage.getItem(calculosKey) || '0', 10) 
      : 0;
    
    console.log('verificarLimiteCalculos: Current calculations count:', calculosRealizados, 'of', LIMITE_CALCULOS_GRATUITOS);
    
    // Se atingiu o limite, mostrar modal de assinatura
    if (calculosRealizados >= LIMITE_CALCULOS_GRATUITOS) {
      console.log('verificarLimiteCalculos: Calculation limit reached');
      toast.error(`Você atingiu o limite de ${LIMITE_CALCULOS_GRATUITOS} cálculos. Assine o plano premium para continuar.`);
      setShowSubscriptionModal(true);
      return;
    }
    
    // Incrementar contador e salvar
    const novoValor = calculosRealizados + 1;
    localStorage.setItem(calculosKey, novoValor.toString());
    console.log('verificarLimiteCalculos: Updated calculation count to:', novoValor);
    
    // Atualizar estado se necessário
    if (novoValor >= LIMITE_CALCULOS_GRATUITOS) {
      setPodeCalcular(false);
    }
    
    // Executar o cálculo original
    return originalCalc();
  };

  return {
    podeCalcular,
    showSubscriptionModal,
    setShowSubscriptionModal,
    verificarLimiteCalculos
  };
};
