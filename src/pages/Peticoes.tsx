
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/auth/useSupabaseAuth';
import PeticoesManager from '@/components/peticoes/PeticoesManager';

/**
 * Página principal de Petições
 * Esta página foi refatorada para usar componentes menores
 * e mais focados para melhor manutenção.
 */
const Peticoes = () => {
  const navigate = useNavigate();
  const { user, loading } = useSupabaseAuth();

  // Verificar se o usuário está logado
  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-juriscalc-navy"></div>
      </div>
    );
  }

  return <PeticoesManager />;
};

export default Peticoes;
