
import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import CalculadoraContainer from '@/components/calculadora/CalculadoraContainer';
import PrintVersionCalculadora from '@/components/calculadora/PrintVersionCalculadora';
import useCalculadora from '@/hooks/useCalculadora';

const Calculadora = () => {
  const navigate = useNavigate();
  const { resultados, dadosContrato } = useCalculadora();
  const calculosSalvosRef = useRef<HTMLDivElement>(null);

  // Verificar se o usuário está logado
  React.useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/');
    }
  }, [navigate]);

  // Função para rolar até a seção de cálculos salvos
  const scrollToCalculosSalvos = () => {
    if (calculosSalvosRef.current) {
      calculosSalvosRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Forçar atualização da lista de cálculos salvos periodicamente
  useEffect(() => {
    // Disparar evento de atualização de cálculos ao montar o componente
    window.dispatchEvent(new Event('calculosSalvosUpdated'));
    
    // Configurar intervalo para verificar se há novos cálculos
    const intervalId = setInterval(() => {
      window.dispatchEvent(new Event('calculosSalvosUpdated'));
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div ref={calculosSalvosRef}>
          <CalculadoraContainer scrollToCalculosSalvos={scrollToCalculosSalvos} />
        </div>
        {/* Versão apenas para impressão - separada da visualização normal */}
        <div id="print-content" className="print:block hidden">
          <PrintVersionCalculadora 
            resultados={resultados} 
            dadosContrato={dadosContrato}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Calculadora;
