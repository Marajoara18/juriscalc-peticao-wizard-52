
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
    // Check if we have an initial view set in location state
    if (location.state && location.state.initialView) {
      setView(location.state.initialView);
      // Clean up the location state
      window.history.replaceState({}, document.title);
    }
  }, [location, setView]);
  
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
  return (
    <PeticoesProvider>
      <PeticoesContent />
    </PeticoesProvider>
  );
};

export default PeticoesManager;
