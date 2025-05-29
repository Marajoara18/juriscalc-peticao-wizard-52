
import React, { useEffect } from 'react';
import { usePeticoes, PeticoesProvider } from '@/contexts/PeticoesContext';
import ListView from '@/components/peticoes/views/ListView';
import EditorView from '@/components/peticoes/views/EditorView';
import UserAccountView from '@/components/peticoes/views/UserAccountView';
import { useLocation } from 'react-router-dom';

// This component renders the appropriate view based on the current state
const PeticoesContent = () => {
  const { view, setView } = usePeticoes();
  const location = useLocation();
  
  useEffect(() => {
    console.log('PETICOES_MANAGER: Verificando localização:', {
      currentPath: location.pathname,
      currentView: view,
      locationState: location.state
    });

    // Se estamos na rota /minha-conta, definir a view como 'user'
    if (location.pathname === '/minha-conta') {
      console.log('PETICOES_MANAGER: Definindo view como user para rota /minha-conta');
      setView('user');
    }
    // Check if we have an initial view set in location state
    else if (location.state && location.state.initialView) {
      console.log('PETICOES_MANAGER: Definindo view inicial do state:', location.state.initialView);
      setView(location.state.initialView);
      // Clean up the location state
      window.history.replaceState({}, document.title);
    }
  }, [location, setView]);
  
  console.log('PETICOES_MANAGER: Renderizando view:', view);
  
  if (view === 'user') {
    return <UserAccountView />;
  }

  if (view === 'editor' || view === 'new') {
    return <EditorView />;
  }

  // Default to list view
  return <ListView />;
};

// This is the main component that wraps everything with the context provider
const PeticoesManager = () => {
  console.log('PETICOES_MANAGER: Inicializando PeticoesManager');
  return (
    <PeticoesProvider>
      <PeticoesContent />
    </PeticoesProvider>
  );
};

export default PeticoesManager;
