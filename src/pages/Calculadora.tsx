
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import CalculadoraContainer from '@/components/calculadora/CalculadoraContainer';

const Calculadora = () => {
  const navigate = useNavigate();

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
      </div>
    </Layout>
  );
};

export default Calculadora;
