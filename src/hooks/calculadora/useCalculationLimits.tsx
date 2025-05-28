
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { useSupabaseAuth } from '@/hooks/auth/useSupabaseAuth';

const LIMITE_CALCULOS_GRATUITOS = 3; // Limite correto de 3 cálculos
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
      console.log('LIMITS: No user authenticated');
      setPodeCalcular(false);
      return;
    }

    const userId = user.id;
    
    // Verificar o contador de cálculos do usuário atual
    const calculosKey = `${KEY_CONTADOR_CALCULOS}_${userId}`;
    const calculosRealizados = localStorage.getItem(calculosKey) 
      ? parseInt(localStorage.getItem(calculosKey) || '0', 10) 
      : 0;
    
    // Verificar se o usuário é premium (via Supabase profile ou localStorage)
    const isPremiumProfile = profile?.plano_id === 'premium_mensal' || profile?.plano_id === 'premium_anual' || profile?.plano_id === 'admin';
    
    // Verificar acesso premium via localStorage (definido pelo admin)
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const currentUser = allUsers.find((u: any) => u.email === user.email);
    const isPremiumLocalStorage = currentUser?.isPremium || currentUser?.isAdmin;
    
    // Usuário tem premium se tiver via profile OU via localStorage
    const isPremium = isPremiumProfile || isPremiumLocalStorage;
    
    console.log('LIMITS: Calculation limits check:', {
      userId,
      userEmail: user.email,
      calculosRealizados,
      isPremiumProfile,
      isPremiumLocalStorage,
      isPremium,
      limite: LIMITE_CALCULOS_GRATUITOS,
      planId: profile?.plano_id,
      remainingCalculations: isPremium ? 'unlimited' : Math.max(0, LIMITE_CALCULOS_GRATUITOS - calculosRealizados)
    });
    
    // Para usuários premium, sempre permitir calcular
    if (isPremium) {
      console.log('LIMITS: Premium user - unlimited calculations');
      setPodeCalcular(true);
      return;
    }
    
    // Para usuários não premium, verificar limite de cálculos
    const podeCalcularNovo = calculosRealizados < LIMITE_CALCULOS_GRATUITOS;
    console.log('LIMITS: Setting podeCalcular to:', podeCalcularNovo, 
      `(${calculosRealizados}/${LIMITE_CALCULOS_GRATUITOS} used)`);
    setPodeCalcular(podeCalcularNovo);
  }, [user, profile]);

  // Função para verificar e incrementar contador de cálculos
  const verificarLimiteCalculos = (originalCalc: () => void) => {
    if (!user) {
      console.error('LIMITS: No user authenticated');
      toast.error('Você precisa estar logado para realizar cálculos');
      return;
    }

    const userId = user.id;
    
    // Verificar se o usuário é premium (via Supabase profile ou localStorage)
    const isPremiumProfile = profile?.plano_id === 'premium_mensal' || profile?.plano_id === 'premium_anual' || profile?.plano_id === 'admin';
    
    // Verificar acesso premium via localStorage (definido pelo admin)
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const currentUser = allUsers.find((u: any) => u.email === user.email);
    const isPremiumLocalStorage = currentUser?.isPremium || currentUser?.isAdmin;
    
    // Usuário tem premium se tiver via profile OU via localStorage
    const isPremium = isPremiumProfile || isPremiumLocalStorage;
    
    console.log('LIMITS: Checking calculation limits before execution:', { 
      userId, 
      userEmail: user.email,
      isPremiumProfile,
      isPremiumLocalStorage,
      isPremium,
      planId: profile?.plano_id
    });
    
    // Para usuários premium, não há limitação
    if (isPremium) {
      console.log('LIMITS: Premium user - executing calculation without limits');
      return originalCalc();
    }
    
    // Para usuários não premium, verificar e incrementar contador
    const calculosKey = `${KEY_CONTADOR_CALCULOS}_${userId}`;
    const calculosRealizados = localStorage.getItem(calculosKey) 
      ? parseInt(localStorage.getItem(calculosKey) || '0', 10) 
      : 0;
    
    console.log('LIMITS: Current calculations count:', calculosRealizados, 'of', LIMITE_CALCULOS_GRATUITOS);
    
    // Se atingiu o limite, mostrar modal de assinatura
    if (calculosRealizados >= LIMITE_CALCULOS_GRATUITOS) {
      console.log('LIMITS: Calculation limit reached - showing subscription modal');
      toast.error(`Você atingiu o limite de ${LIMITE_CALCULOS_GRATUITOS} cálculos gratuitos. Assine o plano premium para continuar.`);
      setShowSubscriptionModal(true);
      return;
    }
    
    // Incrementar contador e salvar
    const novoValor = calculosRealizados + 1;
    localStorage.setItem(calculosKey, novoValor.toString());
    console.log('LIMITS: Updated calculation count to:', novoValor, 
      `(${LIMITE_CALCULOS_GRATUITOS - novoValor} calculations remaining)`);
    
    // Atualizar estado se necessário
    if (novoValor >= LIMITE_CALCULOS_GRATUITOS) {
      console.log('LIMITS: Limit reached after this calculation');
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
