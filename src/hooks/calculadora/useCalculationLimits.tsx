
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
    
    // Verificar se o usuário pode calcular
    if (!podeCalcular) {
      setShowSubscriptionModal(true);
      toast.error('Você atingiu o limite de 3 cálculos. Apague algum cálculo existente para continuar calculando.');
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
      toast.warning(`Este é seu último cálculo disponível. Você atingiu o limite de ${LIMITE_CALCULOS_GRATUITOS} cálculos.`);
    } else if (novoValor === LIMITE_CALCULOS_GRATUITOS - 1) {
      toast.warning(`Você tem apenas mais 1 cálculo disponível.`);
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
