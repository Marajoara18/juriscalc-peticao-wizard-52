
import React, { useRef } from 'react';
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
