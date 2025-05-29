
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UsePeticoesDataProps {
  setPeticoesRecentes: (peticoes: any[]) => void;
  setIsPremium: (premium: boolean) => void;
  setIsAdmin: (admin: boolean) => void;
  setIsViewingAsUser: (viewing: boolean) => void;
  setViewingBanner: (banner: string | null) => void;
}

export const usePeticoesData = ({
  setPeticoesRecentes,
  setIsPremium,
  setIsAdmin,
  setIsViewingAsUser,
  setViewingBanner
}: UsePeticoesDataProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se existe usuário logado
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/');
      return;
    }
    
    // Verificar se admin está visualizando como outro usuário
    const viewingAsUserId = localStorage.getItem('viewingAsUserId');
    const viewingAsUserName = localStorage.getItem('viewingAsUserName');
    
    if (viewingAsUserId && viewingAsUserName) {
      setIsViewingAsUser(true);
      setViewingBanner(`Visualizando como ${viewingAsUserName}`);
    } else {
      setIsViewingAsUser(false);
      setViewingBanner(null);
    }
    
    // Verificar se usuário é admin
    const userIsAdmin = localStorage.getItem('userIsAdmin') === 'true';
    setIsAdmin(userIsAdmin);
    
    const storedPeticoes = localStorage.getItem('peticoesRecentes');
    if (storedPeticoes) {
      try {
        const allPeticoes = JSON.parse(storedPeticoes);
        
        // Se admin está visualizando como outro usuário, mostrar apenas as petições desse usuário
        if (viewingAsUserId) {
          const filteredPeticoes = allPeticoes.filter((p: any) => !p.userId || p.userId === viewingAsUserId);
          setPeticoesRecentes(filteredPeticoes);
        } else if (userIsAdmin) {
          // Se for admin normal, mostrar petições de todos os usuários
          setPeticoesRecentes(allPeticoes);
        } else {
          // Se for usuário comum, filtrar apenas as próprias petições
          const filteredPeticoes = allPeticoes.filter((p: any) => !p.userId || p.userId === userId);
          setPeticoesRecentes(filteredPeticoes);
        }
      } catch (error) {
        console.error('Erro ao carregar petições:', error);
      }
    }
    
    const userPremium = localStorage.getItem('userPremium') === 'true';
    setIsPremium(userPremium);
  }, [navigate, setPeticoesRecentes, setIsPremium, setIsAdmin, setIsViewingAsUser, setViewingBanner]);
};
