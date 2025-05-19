
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import CalculadoraContainer from '@/components/calculadora/CalculadoraContainer';
import PrintVersionCalculadora from '@/components/calculadora/PrintVersionCalculadora';
import useCalculadora from '@/hooks/useCalculadora';

const Calculadora = () => {
  const navigate = useNavigate();
  const { resultados } = useCalculadora();

  // Verificar se o usuário está logado
  React.useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <CalculadoraContainer />
        {/* Versão apenas para impressão */}
        <div id="print-content">
          <PrintVersionCalculadora resultados={resultados} />
        </div>
      </div>
    </Layout>
  );
};

export default Calculadora;
