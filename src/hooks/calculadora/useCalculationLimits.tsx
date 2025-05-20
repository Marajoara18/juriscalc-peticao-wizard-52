
import { useState, useEffect } from 'react';
import { toast } from "sonner";

const LIMITE_CALCULOS_GRATUITOS = 3;
const KEY_CONTADOR_CALCULOS = 'calculosRealizados';

export const useCalculationLimits = () => {
  // Estado para controlar se o usuário pode realizar mais cálculos
  const [podeCalcular, setPodeCalcular] = useState<boolean>(true);
  
  // Estado para controlar a modal de assinatura
  const [showSubscriptionModal, setShowSubscriptionModal] = useState<boolean>(false);
  
  // Verificar número de cálculos realizados pelo usuário (apenas para fins de monitoramento)
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    
    // Verificar o contador de cálculos do usuário atual
    const calculosKey = `${KEY_CONTADOR_CALCULOS}_${userId}`;
    const calculosRealizados = localStorage.getItem(calculosKey) 
      ? parseInt(localStorage.getItem(calculosKey) || '0', 10) 
      : 0;
    
    // Verificar se o usuário é premium
    const isPremium = localStorage.getItem('isPremium') === 'true';
    
    // Para usuários premium, sempre permitir calcular
    if (isPremium) {
      setPodeCalcular(true);
      return;
    }
    
    // Para usuários não premium, verificar limite de cálculos
    setPodeCalcular(calculosRealizados < LIMITE_CALCULOS_GRATUITOS);
  }, []);

  // Função para verificar e incrementar contador de cálculos
  const verificarLimiteCalculos = (originalCalc: () => void) => {
    const userId = localStorage.getItem('userId') || 'anonymous';
    const isPremium = localStorage.getItem('isPremium') === 'true';
    
    // Para usuários premium, não há limitação
    if (isPremium) {
      return originalCalc();
    }
    
    // Para usuários não premium, verificar e incrementar contador
    const calculosKey = `${KEY_CONTADOR_CALCULOS}_${userId}`;
    const calculosRealizados = localStorage.getItem(calculosKey) 
      ? parseInt(localStorage.getItem(calculosKey) || '0', 10) 
      : 0;
    
    // Se atingiu o limite, mostrar modal de assinatura
    if (calculosRealizados >= LIMITE_CALCULOS_GRATUITOS) {
      toast.error(`Você atingiu o limite de ${LIMITE_CALCULOS_GRATUITOS} cálculos. Assine o plano premium para continuar.`);
      setShowSubscriptionModal(true);
      return;
    }
    
    // Incrementar contador e salvar
    const novoValor = calculosRealizados + 1;
    localStorage.setItem(calculosKey, novoValor.toString());
    
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
