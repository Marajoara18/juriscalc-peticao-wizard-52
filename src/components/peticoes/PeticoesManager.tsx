import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { initializeLocalStorage } from '@/utils/localStorage';
import PeticoesHeader from '@/components/peticoes/PeticoesHeader';
import PeticoesViews from '@/components/peticoes/PeticoesViews';
import EditorPeticao from '@/components/peticoes/EditorPeticao';
import PremiumAlert from '@/components/peticoes/PremiumAlert';
import HelpSection from '@/components/peticoes/HelpSection';
import UserManagement from '@/components/auth/UserManagement';
import MasterPasswordReset from '@/components/auth/MasterPasswordReset';
import { peticoesModelo } from '@/data/peticoes-modelo';

const PeticoesManager = () => {
  const navigate = useNavigate();
  const [selectedModeloId, setSelectedModeloId] = useState<number | null>(null);
  const [selectedPeticaoId, setSelectedPeticaoId] = useState<number | null>(null);
  const [view, setView] = useState<'list' | 'editor' | 'new' | 'user'>('list');
  const [peticoesRecentes, setPeticoesRecentes] = useState<any[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isViewingAsUser, setIsViewingAsUser] = useState(false);
  const [viewingBanner, setViewingBanner] = useState<string | null>(null);
  
  // Carrega dados do localStorage
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
    
    initializeLocalStorage();
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
  }, [navigate]);
  
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
      navigate('/peticoes');
    }
  };

  const selectedModelo = peticoesModelo.find(m => m.id === selectedModeloId);
  const selectedPeticao = peticoesRecentes.find(p => p.id === selectedPeticaoId);
  
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

  const handleSavePeticao = (data: any) => {
    // Adicionar ID do usuário atual à petição
    const currentUserId = localStorage.getItem('userId');
    const updatedData = {
      ...data,
      userId: currentUserId
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
    
    // Filtrar petições com base no tipo de usuário
    const currentUserIsAdmin = localStorage.getItem('userIsAdmin') === 'true';
    
    const filteredPeticoes = currentUserIsAdmin
      ? updatedPeticoes
      : updatedPeticoes.filter(p => !p.userId || p.userId === currentUserId);
    
    setPeticoesRecentes(filteredPeticoes);
    
    toast.success(`Petição ${data.status === 'finalizada' ? 'finalizada' : 'salva como rascunho'} com sucesso!`);
    handleVoltar();
  };

  const handleUserClick = () => {
    setView('user');
  };

  const handleDeletePeticao = (id: number) => {
    const storedPeticoes = localStorage.getItem('peticoesRecentes');
    if (storedPeticoes) {
      try {
        const allPeticoes = JSON.parse(storedPeticoes);
        
        // Filtrar a petição a ser excluída
        const updatedPeticoes = allPeticoes.filter((p: any) => p.id !== id);
        
        // Atualizar localStorage
        localStorage.setItem('peticoesRecentes', JSON.stringify(updatedPeticoes));
        
        // Filtrar petições com base no tipo de usuário
        const currentUserId = localStorage.getItem('userId');
        const currentUserIsAdmin = localStorage.getItem('userIsAdmin') === 'true';
        
        const filteredPeticoes = currentUserIsAdmin
          ? updatedPeticoes
          : updatedPeticoes.filter(p => !p.userId || p.userId === currentUserId);
        
        setPeticoesRecentes(filteredPeticoes);
        
        toast.success('Petição excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir petição:', error);
        toast.error('Erro ao excluir petição. Tente novamente.');
      }
    }
  };

  if (view === 'user') {
    return (
      <Layout>
        <div className="container mx-auto py-10 px-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-serif font-semibold">Minha Conta</h2>
            <Button variant="outline" onClick={handleVoltar} className="border-juriscalc-navy text-juriscalc-navy">
              Voltar
            </Button>
          </div>
          
          <UserManagement />
          
          {/* Componente de redefinição de senha do master */}
          <MasterPasswordReset />
        </div>
      </Layout>
    );
  }

  if (view === 'editor' || view === 'new') {
    return (
      <Layout>
        <div className="container mx-auto py-10 px-4">
          {isViewingAsUser && viewingBanner && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded-md flex justify-between items-center">
              <p className="text-yellow-800">{viewingBanner}</p>
              <Button 
                variant="outline" 
                onClick={handleStopViewingAs}
                className="text-yellow-800 border-yellow-500 hover:bg-yellow-100"
              >
                Voltar à visualização normal
              </Button>
            </div>
          )}
          
          <EditorPeticao 
            modelo={selectedModelo} 
            peticao={selectedPeticao}
            onVoltar={handleVoltar}
            onSave={handleSavePeticao}
          />
        </div>
      </Layout>
    );
  }

  // Agora todos os usuários podem ver sua lista de petições
  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        {isViewingAsUser && viewingBanner && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded-md flex justify-between items-center">
            <p className="text-yellow-800">{viewingBanner}</p>
            <Button 
              variant="outline" 
              onClick={handleStopViewingAs}
              className="text-yellow-800 border-yellow-500 hover:bg-yellow-100"
            >
              Voltar à visualização normal
            </Button>
          </div>
        )}
        
        <PeticoesHeader 
          onNewPeticao={handleNovaPeticao}
          onUserClick={handleUserClick}
        />

        {!isPremium && <PremiumAlert />}

        <PeticoesViews 
          peticoesRecentes={peticoesRecentes}
          onUseModelo={handleUseModelo}
          onEditPeticao={handleEditPeticao}
          onDeletePeticao={handleDeletePeticao}
        />

        <HelpSection />
      </div>
    </Layout>
  );
};

export default PeticoesManager;
