
import React, { useRef, useEffect } from 'react';
import Layout from '@/components/Layout';
import CalculadoraContainer from '@/components/calculadora/CalculadoraContainer';
import useCalculadora from '@/hooks/useCalculadora';
import { initializeTestModeKeyboard, activateTestMode } from '@/utils/testModeUtils';

const Calculadora = () => {
  const { resultados, dadosContrato } = useCalculadora();
  const calculosSalvosRef = useRef<HTMLDivElement>(null);

  // Função para rolar até a seção de cálculos salvos
  const scrollToCalculosSalvos = () => {
    if (calculosSalvosRef.current) {
      calculosSalvosRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Inicializar funcionalidades do modo de teste
  useEffect(() => {
    // Inicializar atalhos de teclado
    const cleanup = initializeTestModeKeyboard();
    
    // Verificar parâmetro de URL para ativação do modo de teste
    const urlParams = new URLSearchParams(window.location.search);
    const testModeParam = urlParams.get('test_mode');
    
    if (testModeParam === 'unlimited') {
      activateTestMode();
      console.log('✅ Test mode activated via URL parameter');
    }
    
    // Cleanup na desmontagem
    return cleanup;
  }, []);

  console.log('CALCULADORA: Renderizando página da calculadora');
  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div ref={calculosSalvosRef}>
          <CalculadoraContainer 
            scrollToCalculosSalvos={scrollToCalculosSalvos}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Calculadora;
