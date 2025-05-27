
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
    console.log('Peticoes page - Auth state check:', { 
      user: !!user, 
      loading, 
      userId: user?.id,
      currentPath: window.location.pathname 
    });
    
    if (!loading && !user) {
      console.log('User not authenticated, redirecting to login from Peticoes');
      navigate('/', { replace: true });
    } else if (user) {
      console.log('User authenticated, allowing access to Peticoes');
    }
  }, [user, loading, navigate]);

  // Show loading while checking authentication
  if (loading) {
    console.log('Peticoes page - showing loading state');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-juriscalc-navy"></div>
      </div>
    );
  }

  // If user is not authenticated, show loading (redirect will happen)
  if (!user) {
    console.log('Peticoes page - no user, showing loading while redirecting');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-juriscalc-navy"></div>
      </div>
    );
  }

  console.log('Peticoes page - rendering PeticoesManager for authenticated user');
  return <PeticoesManager />;
};

export default Peticoes;
