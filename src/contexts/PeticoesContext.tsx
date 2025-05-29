
import React, { createContext, useContext, ReactNode } from 'react';
import { PeticoesContextType } from '@/types/peticoesContext';
import { usePeticoesState } from '@/hooks/peticoes/usePeticoesState';
import { usePeticoesActions } from '@/hooks/peticoes/usePeticoesActions';
import { usePeticoesData } from '@/hooks/peticoes/usePeticoesData';

const PeticoesContext = createContext<PeticoesContextType | undefined>(undefined);

export const usePeticoes = () => {
  const context = useContext(PeticoesContext);
  if (context === undefined) {
    throw new Error('usePeticoes must be used within a PeticoesProvider');
  }
  return context;
};

export const PeticoesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    selectedModeloId,
    setSelectedModeloId,
    selectedPeticaoId,
    setSelectedPeticaoId,
    view,
    setView,
    peticoesRecentes,
    setPeticoesRecentes,
    isPremium,
    setIsPremium,
    isAdmin,
    setIsAdmin,
    isViewingAsUser,
    setIsViewingAsUser,
    viewingBanner,
    setViewingBanner
  } = usePeticoesState();

  const actions = usePeticoesActions({
    isPremium,
    setView,
    setSelectedModeloId,
    setSelectedPeticaoId,
    setPeticoesRecentes,
    setIsViewingAsUser,
    setViewingBanner
  });

  // Load data on mount
  usePeticoesData({
    setPeticoesRecentes,
    setIsPremium,
    setIsAdmin,
    setIsViewingAsUser,
    setViewingBanner
  });

  const value = {
    peticoesRecentes,
    selectedModeloId,
    selectedPeticaoId,
    view,
    isPremium,
    isAdmin,
    isViewingAsUser,
    viewingBanner,
    setView,
    ...actions
  };

  return (
    <PeticoesContext.Provider value={value}>
      {children}
    </PeticoesContext.Provider>
  );
};

export default PeticoesContext;
