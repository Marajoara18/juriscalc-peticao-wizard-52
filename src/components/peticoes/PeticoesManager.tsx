
import React from 'react';
import { usePeticoes, PeticoesProvider } from '@/contexts/PeticoesContext';
import ListView from '@/components/peticoes/views/ListView';
import EditorView from '@/components/peticoes/views/EditorView';
import UserAccountView from '@/components/peticoes/views/UserAccountView';

// This component renders the appropriate view based on the current state
const PeticoesContent = () => {
  const { view } = usePeticoes();
  
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
