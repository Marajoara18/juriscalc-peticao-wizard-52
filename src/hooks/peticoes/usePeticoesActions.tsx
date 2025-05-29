
import { toast } from 'sonner';
import { useSupabaseAuthOnly } from '@/hooks/auth/useSupabaseAuthOnly';

interface UsePeticoesActionsProps {
  isPremium: boolean;
  setView: (view: 'list' | 'editor' | 'new' | 'user') => void;
  setSelectedModeloId: (id: number | null) => void;
  setSelectedPeticaoId: (id: number | null) => void;
  setPeticoesRecentes: (peticoes: any[]) => void;
  setIsViewingAsUser: (viewing: boolean) => void;
  setViewingBanner: (banner: string | null) => void;
}

export const usePeticoesActions = ({
  isPremium,
  setView,
  setSelectedModeloId,
  setSelectedPeticaoId,
  setPeticoesRecentes,
  setIsViewingAsUser,
  setViewingBanner
}: UsePeticoesActionsProps) => {
  const { user, profile } = useSupabaseAuthOnly();
  
  const handleNovaPeticao = () => {
    // Verificar limite de petições para usuários gratuitos
    if (!isPremium) {
      const count = parseInt(localStorage.getItem('peticoesCount') || '0');
      if (count >= 3) {
        toast.error('Você atingiu o limite de 3 petições gratuitas. Assine o plano premium para continuar.');
        return;
      }
    }
    
    setView('new');
    setSelectedModeloId(null);
    setSelectedPeticaoId(null);
  };
  
  const handleUseModelo = (id: number) => {
    // Verificar limite de petições para usuários gratuitos
    if (!isPremium) {
      const count = parseInt(localStorage.getItem('peticoesCount') || '0');
      if (count >= 3) {
        toast.error('Você atingiu o limite de 3 petições gratuitas. Assine o plano premium para continuar.');
        return;
      }
    }
    
    setSelectedModeloId(id);
    setView('editor');
    toast.info('Modelo selecionado! Preencha os dados necessários.');
  };
  
  const handleEditPeticao = (id: number) => {
    setSelectedPeticaoId(id);
    setView('editor');
  };
  
  const handleVoltar = () => {
    setView('list');
    setSelectedModeloId(null);
    setSelectedPeticaoId(null);
  };

  const handleUserClick = () => {
    setView('user');
  };

  const handleStopViewingAs = () => {
    const originalUserId = localStorage.getItem('originalUserId');
    if (originalUserId) {
      localStorage.removeItem('viewingAsUserId');
      localStorage.removeItem('viewingAsUserName');
      localStorage.removeItem('viewingAsUserEmail');
      localStorage.removeItem('originalUserId');
      
      setIsViewingAsUser(false);
      setViewingBanner(null);
      
      toast.success('Retornando à visualização normal');
      window.location.href = '/peticoes';
    }
  };

  const handleSavePeticao = (data: any) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    // Adicionar ID do usuário atual à petição
    const updatedData = {
      ...data,
      userId: user.id
    };
  
    // Carregar todas as petições armazenadas
    const allPeticoes = JSON.parse(localStorage.getItem('peticoesRecentes') || '[]');
    let updatedPeticoes = [...allPeticoes];
    
    const existingIndex = updatedPeticoes.findIndex(p => p.id === data.id);
    
    if (existingIndex >= 0) {
      // Atualiza petição existente
      updatedPeticoes[existingIndex] = updatedData;
    } else {
      // Adiciona nova petição
      updatedPeticoes.unshift(updatedData);
      
      // Incrementa contador para usuários não premium
      if (!isPremium) {
        const count = parseInt(localStorage.getItem('peticoesCount') || '0');
        localStorage.setItem('peticoesCount', String(count + 1));
      }
    }
    
    // Atualizar no localStorage todas as petições
    localStorage.setItem('peticoesRecentes', JSON.stringify(updatedPeticoes));
    
    // Filtrar petições com base no tipo de usuário via Supabase
    const currentUserIsAdmin = profile?.plano_id === 'admin';
    
    const filteredPeticoes = currentUserIsAdmin
      ? updatedPeticoes
      : updatedPeticoes.filter(p => !p.userId || p.userId === user.id);
    
    setPeticoesRecentes(filteredPeticoes);
    
    toast.success(`Petição ${data.status === 'finalizada' ? 'finalizada' : 'salva como rascunho'} com sucesso!`);
    handleVoltar();
  };

  const handleDeletePeticao = (id: number) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    const storedPeticoes = localStorage.getItem('peticoesRecentes');
    if (storedPeticoes) {
      try {
        const allPeticoes = JSON.parse(storedPeticoes);
        
        // Filtrar a petição a ser excluída
        const updatedPeticoes = allPeticoes.filter((p: any) => p.id !== id);
        
        // Atualizar localStorage
        localStorage.setItem('peticoesRecentes', JSON.stringify(updatedPeticoes));
        
        // Filtrar petições com base no tipo de usuário via Supabase
        const currentUserIsAdmin = profile?.plano_id === 'admin';
        
        const filteredPeticoes = currentUserIsAdmin
          ? updatedPeticoes
          : updatedPeticoes.filter(p => !p.userId || p.userId === user.id);
        
        setPeticoesRecentes(filteredPeticoes);
        
        toast.success('Petição excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir petição:', error);
        toast.error('Erro ao excluir petição. Tente novamente.');
      }
    }
  };

  return {
    handleNovaPeticao,
    handleUseModelo,
    handleEditPeticao,
    handleVoltar,
    handleUserClick,
    handleStopViewingAs,
    handleSavePeticao,
    handleDeletePeticao
  };
};
