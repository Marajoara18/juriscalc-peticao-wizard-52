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
import { Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PeticoesManager = () => {
  const navigate = useNavigate();
  const [selectedModeloId, setSelectedModeloId] = useState<number | null>(null);
  const [selectedPeticaoId, setSelectedPeticaoId] = useState<number | null>(null);
  const [view, setView] = useState<'list' | 'editor' | 'new' | 'user'>('list');
  const [peticoesRecentes, setPeticoesRecentes] = useState<any[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [canViewPanels, setCanViewPanels] = useState(false);
  
  // Carrega dados do localStorage
  useEffect(() => {
    // Verificar se existe usuário logado
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/');
      return;
    }
    
    // Verificar se usuário tem permissão para ver painéis
    const userCanViewPanels = localStorage.getItem('canViewPanels') === 'true';
    const userIsAdmin = localStorage.getItem('userIsAdmin') === 'true';
    
    // Admin sempre pode ver painéis
    setCanViewPanels(userIsAdmin || userCanViewPanels);
    
    initializeLocalStorage();
    const storedPeticoes = localStorage.getItem('peticoesRecentes');
    if (storedPeticoes) {
      try {
        const allPeticoes = JSON.parse(storedPeticoes);
        
        // Filtrar petições do usuário atual
        const userPeticoes = allPeticoes.filter((p: any) => 
          !p.userId || p.userId === userId
        );
        
        setPeticoesRecentes(userPeticoes);
      } catch (error) {
        console.error('Erro ao carregar petições:', error);
      }
    }
    
    const userPremium = localStorage.getItem('userPremium') === 'true';
    setIsPremium(userPremium);
  }, [navigate]);
  
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
    const userId = localStorage.getItem('userId');
    const updatedData = {
      ...data,
      userId
    };
  
    // Carregar todas as petições armazenadas (não apenas do usuário atual)
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
    
    // Filtrar apenas as petições do usuário atual para o state
    const userPeticoes = updatedPeticoes.filter(p => !p.userId || p.userId === userId);
    setPeticoesRecentes(userPeticoes);
    
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
        
        // Filter out the petition to delete
        const updatedPeticoes = allPeticoes.filter((p: any) => p.id !== id);
        
        // Update localStorage
        localStorage.setItem('peticoesRecentes', JSON.stringify(updatedPeticoes));
        
        // Update state with only user's petitions
        const userId = localStorage.getItem('userId');
        const userPeticoes = updatedPeticoes.filter((p: any) => 
          !p.userId || p.userId === userId
        );
        
        setPeticoesRecentes(userPeticoes);
        
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

  // Verificar permissão para visualizar os painéis
  if (!canViewPanels) {
    return (
      <Layout>
        <div className="container mx-auto py-10 px-4">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center text-red-800">
                <Shield className="h-5 w-5 mr-2" />
                Acesso Restrito
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-4 text-red-700">
                Você não possui permissão para visualizar os painéis de petições. 
                Entre em contato com o administrador mestre para solicitar acesso.
              </p>
              <div className="flex justify-center mt-4">
                <Button 
                  variant="outline" 
                  onClick={handleUserClick} 
                  className="border-juriscalc-navy text-juriscalc-navy"
                >
                  Acessar Minha Conta
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
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
