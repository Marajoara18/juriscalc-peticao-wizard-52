
import React, { createContext, useContext, ReactNode } from 'react';
import { PeticoesContextType } from '@/types/peticoesContext';
import { usePeticoesState } from '@/hooks/peticoes/usePeticoesState';
import { usePeticoesActions } from '@/hooks/peticoes/usePeticoesActions';
import { usePeticoesData } from '@/hooks/peticoes/usePeticoesData';
import { useSupabaseAuthOnly } from '@/hooks/auth/useSupabaseAuthOnly';

const PeticoesContext = createContext<PeticoesContextType | undefined>(undefined);

export const usePeticoes = () => {
  const context = useContext(PeticoesContext);
  if (context === undefined) {
    throw new Error('usePeticoes must be used within a PeticoesProvider');
  }
  return context;
};

export const PeticoesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, profile, loading } = useSupabaseAuthOnly();
  
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

  console.log('PETICOES_CONTEXT: Estado atual:', {
    user: !!user,
    profile: !!profile,
    loading,
    isPremium,
    isAdmin,
    view,
    peticoesCount: peticoesRecentes.length
  });

  // Se ainda está carregando a autenticação, mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-juriscalc-blue via-juriscalc-navy to-juriscalc-gold">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg font-medium">Carregando petições...</p>
          <p className="text-sm opacity-75 mt-2">Aguarde um momento</p>
        </div>
      </div>
    );
  }

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
