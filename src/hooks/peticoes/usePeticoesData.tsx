
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuthOnly } from '@/hooks/auth/useSupabaseAuthOnly';

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
  const { user, profile, loading } = useSupabaseAuthOnly();

  useEffect(() => {
    // Se ainda está carregando, não fazer nada
    if (loading) {
      console.log('PETICOES_DATA: Ainda carregando autenticação...');
      return;
    }

    // Verificar se existe usuário logado
    if (!user) {
      console.log('PETICOES_DATA: Usuário não autenticado, redirecionando para /');
      navigate('/');
      return;
    }

    console.log('PETICOES_DATA: Usuário autenticado:', {
      userId: user.id,
      userEmail: user.email,
      profile: !!profile,
      planId: profile?.plano_id
    });
    
    // Verificar se admin está visualizando como outro usuário (manter funcionalidade existente)
    const viewingAsUserId = localStorage.getItem('viewingAsUserId');
    const viewingAsUserName = localStorage.getItem('viewingAsUserName');
    
    if (viewingAsUserId && viewingAsUserName) {
      setIsViewingAsUser(true);
      setViewingBanner(`Visualizando como ${viewingAsUserName}`);
    } else {
      setIsViewingAsUser(false);
      setViewingBanner(null);
    }
    
    // Verificar se usuário é admin via Supabase profile
    const userIsAdmin = profile?.plano_id === 'admin';
    setIsAdmin(userIsAdmin);
    
    // Carregar petições do localStorage
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
          const filteredPeticoes = allPeticoes.filter((p: any) => !p.userId || p.userId === user.id);
          setPeticoesRecentes(filteredPeticoes);
        }
      } catch (error) {
        console.error('PETICOES_DATA: Erro ao carregar petições:', error);
      }
    }
    
    // Verificar se usuário é premium via Supabase profile
    const userPremium = profile?.plano_id === 'premium_mensal' || 
                       profile?.plano_id === 'premium_anual' || 
                       profile?.plano_id === 'admin';
    setIsPremium(userPremium);

    console.log('PETICOES_DATA: Estado definido:', {
      isPremium: userPremium,
      isAdmin: userIsAdmin,
      isViewingAsUser: !!viewingAsUserId
    });
  }, [user, profile, loading, navigate, setPeticoesRecentes, setIsPremium, setIsAdmin, setIsViewingAsUser, setViewingBanner]);
};
