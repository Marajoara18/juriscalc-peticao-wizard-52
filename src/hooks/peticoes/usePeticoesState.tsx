
import { useState } from 'react';

export const usePeticoesState = () => {
  const [selectedModeloId, setSelectedModeloId] = useState<number | null>(null);
  const [selectedPeticaoId, setSelectedPeticaoId] = useState<number | null>(null);
  const [view, setView] = useState<'list' | 'editor' | 'new' | 'user'>('list');
  const [peticoesRecentes, setPeticoesRecentes] = useState<any[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isViewingAsUser, setIsViewingAsUser] = useState(false);
  const [viewingBanner, setViewingBanner] = useState<string | null>(null);

  return {
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
  };
};
