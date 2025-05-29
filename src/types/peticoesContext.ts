
export interface PeticoesContextType {
  peticoesRecentes: any[];
  selectedModeloId: number | null;
  selectedPeticaoId: number | null;
  view: 'list' | 'editor' | 'new' | 'user';
  isPremium: boolean;
  isAdmin: boolean;
  isViewingAsUser: boolean;
  viewingBanner: string | null;
  setView: (view: 'list' | 'editor' | 'new' | 'user') => void;
  handleNovaPeticao: () => void;
  handleUseModelo: (id: number) => void;
  handleEditPeticao: (id: number) => void;
  handleVoltar: () => void;
  handleSavePeticao: (data: any) => void;
  handleUserClick: () => void;
  handleDeletePeticao: (id: number) => void;
  handleStopViewingAs: () => void;
}
