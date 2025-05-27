
import React, { useRef, useEffect } from 'react';
import Layout from '@/components/Layout';
import CalculadoraContainer from '@/components/calculadora/CalculadoraContainer';
import useCalculadora from '@/hooks/useCalculadora';

const Calculadora = () => {
  const { resultados, dadosContrato } = useCalculadora();
  const calculosSalvosRef = useRef<HTMLDivElement>(null);

  // Função para rolar até a seção de cálculos salvos
  const scrollToCalculosSalvos = () => {
    if (calculosSalvosRef.current) {
      calculosSalvosRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Forçar atualização da lista de cálculos salvos ao montar o componente e periodicamente
  useEffect(() => {
    // Carregar cálculos salvos imediatamente ao montar o componente
    window.dispatchEvent(new Event('calculosSalvosUpdated'));
    
    // Log para debug
    console.log('CALCULADORA: Componente montado, disparando evento calculosSalvosUpdated');
    
    // Configurar intervalo para verificar se há novos cálculos
    const intervalId = setInterval(() => {
      window.dispatchEvent(new Event('calculosSalvosUpdated'));
    }, 2000);
    
    return () => clearInterval(intervalId);
  }, []);

  console.log('CALCULADORA: Renderizando componente principal');
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
