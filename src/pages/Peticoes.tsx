
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

  // Verificar se o usuário está logado com logs detalhados
  useEffect(() => {
    console.log('PETICOES: Auth state check started:', { 
      user: !!user, 
      userId: user?.id,
      userEmail: user?.email,
      loading, 
      currentPath: window.location.pathname,
      timestamp: new Date().toISOString()
    });
    
    if (!loading && !user) {
      console.log('PETICOES: User not authenticated, redirecting to login');
      console.log('PETICOES: Redirect details:', {
        from: window.location.pathname,
        to: '/',
        reason: 'no_user_authenticated'
      });
      navigate('/', { replace: true });
    } else if (user) {
      console.log('PETICOES: User authenticated successfully:', {
        userId: user.id,
        email: user.email,
        accessGranted: true
      });
    } else if (loading) {
      console.log('PETICOES: Still loading auth state, waiting...');
    }
  }, [user, loading, navigate]);

  // Show loading while checking authentication
  if (loading) {
    console.log('PETICOES: Showing loading state while checking auth');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-juriscalc-navy mx-auto"></div>
          <p className="mt-4 text-juriscalc-navy">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show loading (redirect will happen)
  if (!user) {
    console.log('PETICOES: No user found, showing loading while redirecting');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-juriscalc-navy mx-auto"></div>
          <p className="mt-4 text-juriscalc-navy">Redirecionando para login...</p>
        </div>
      </div>
    );
  }

  console.log('PETICOES: Rendering PeticoesManager for authenticated user:', user.id);
  return <PeticoesManager />;
};

export default Peticoes;
