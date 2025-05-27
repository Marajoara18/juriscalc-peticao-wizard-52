
import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import CalculadoraContainer from '@/components/calculadora/CalculadoraContainer';
import useCalculadora from '@/hooks/useCalculadora';
import { useSupabaseAuth } from '@/hooks/auth/useSupabaseAuth';

const Calculadora = () => {
  const navigate = useNavigate();
  const { user, loading } = useSupabaseAuth();
  const { resultados, dadosContrato } = useCalculadora();
  const calculosSalvosRef = useRef<HTMLDivElement>(null);

  // Função para rolar até a seção de cálculos salvos
  const scrollToCalculosSalvos = () => {
    if (calculosSalvosRef.current) {
      calculosSalvosRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Verificar se o usuário está logado - APÓS todos os hooks
  useEffect(() => {
    console.log('Calculadora page - Auth state:', { user: !!user, loading });
    
    if (!loading && !user) {
      console.log('User not authenticated, redirecting to login');
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Forçar atualização da lista de cálculos salvos ao montar o componente e periodicamente
  useEffect(() => {
    // Carregar cálculos salvos imediatamente ao montar o componente
    window.dispatchEvent(new Event('calculosSalvosUpdated'));
    
    // Log para debug
    console.log('Disparando evento calculosSalvosUpdated');
    
    // Configurar intervalo para verificar se há novos cálculos
    const intervalId = setInterval(() => {
      window.dispatchEvent(new Event('calculosSalvosUpdated'));
    }, 2000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Show loading while checking authentication
  if (loading) {
    console.log('Calculadora page - showing loading state');
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-juriscalc-navy"></div>
        </div>
      </Layout>
    );
  }

  // If user is not authenticated, show loading (redirect will happen)
  if (!user) {
    console.log('Calculadora page - no user, showing loading');
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-juriscalc-navy"></div>
        </div>
      </Layout>
    );
  }

  console.log('Calculadora page - rendering main content');
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
