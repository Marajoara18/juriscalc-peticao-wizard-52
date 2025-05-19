
import { useState, useEffect } from 'react';
import { toast } from "sonner";

const LIMITE_CALCULOS_GRATUITOS = 3;
const KEY_CONTADOR_CALCULOS = 'calculosRealizados';

export const useCalculationLimits = () => {
  // Estado para controlar se o usuário pode realizar mais cálculos
  const [podeCalcular, setPodeCalcular] = useState<boolean>(true);
  
  // Estado para controlar a modal de assinatura
  const [showSubscriptionModal, setShowSubscriptionModal] = useState<boolean>(false);
  
  // Verificar número de cálculos realizados pelo usuário
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    const isAdmin = localStorage.getItem('userIsAdmin') === 'true';
    const isPremium = localStorage.getItem('isPremium') === 'true';
    
    // Verificar diretamente do localStorage para ter dados atualizados
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const currentUser = allUsers.find((u: any) => u.id === userId);
    const isUserPremium = currentUser && (currentUser.isPremium || currentUser.isAdmin);
    
    // Se o usuário for admin, admin mestre, ou premium, pode calcular ilimitadamente
    if (isAdmin || isPremium || isUserPremium || 
        userEmail === 'johnnysantos_177@msn.com' || 
        userEmail === 'admin@juriscalc.com') {
      setPodeCalcular(true);
      return;
    }
    
    // Verificar o contador de cálculos do usuário atual
    const calculosKey = `${KEY_CONTADOR_CALCULOS}_${userId}`;
    const calculosRealizados = localStorage.getItem(calculosKey) 
      ? parseInt(localStorage.getItem(calculosKey) || '0', 10) 
      : 0;
    
    // Se já atingiu o limite, bloquear novos cálculos
    if (calculosRealizados >= LIMITE_CALCULOS_GRATUITOS) {
      setPodeCalcular(false);
    } else {
      setPodeCalcular(true);
    }
  }, []);

  // Função para verificar e incrementar contador de cálculos
  const verificarLimiteCalculos = (originalCalc: () => void) => {
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    const isAdmin = localStorage.getItem('userIsAdmin') === 'true';
    const isPremium = localStorage.getItem('isPremium') === 'true';
    
    // Verificar diretamente do localStorage para ter dados atualizados
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const currentUser = allUsers.find((u: any) => u.id === userId);
    const isUserPremium = currentUser && (currentUser.isPremium || currentUser.isAdmin);
    
    // Se o usuário for admin, admin mestre, ou premium, pode calcular ilimitadamente
    if (isAdmin || isPremium || isUserPremium || 
        userEmail === 'johnnysantos_177@msn.com' || 
        userEmail === 'admin@juriscalc.com') {
      return originalCalc();
    }
    
    // Verificar se o usuário pode calcular
    if (!podeCalcular) {
      setShowSubscriptionModal(true);
      toast.error('Você atingiu o limite de cálculos gratuitos. Assine o plano premium para continuar calculando.');
      return;
    }
    
    // Incrementar contador de cálculos
    const calculosKey = `${KEY_CONTADOR_CALCULOS}_${userId}`;
    const calculosRealizados = localStorage.getItem(calculosKey) 
      ? parseInt(localStorage.getItem(calculosKey) || '0', 10) 
      : 0;
    
    const novoValor = calculosRealizados + 1;
    localStorage.setItem(calculosKey, novoValor.toString());
    
    // Verificar se atingiu o limite após este cálculo
    if (novoValor >= LIMITE_CALCULOS_GRATUITOS) {
      setPodeCalcular(false);
      toast.warning(`Este é seu último cálculo gratuito. Para continuar calculando, assine o plano premium.`);
    } else if (novoValor === LIMITE_CALCULOS_GRATUITOS - 1) {
      toast.warning(`Você tem apenas mais 1 cálculo gratuito disponível.`);
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
