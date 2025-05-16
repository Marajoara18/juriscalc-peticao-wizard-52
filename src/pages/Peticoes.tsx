
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FileText, Plus, LogOut } from 'lucide-react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import refactored components
import ModeloCard from '@/components/peticoes/ModeloCard';
import PeticaoRecenteCard from '@/components/peticoes/PeticaoRecenteCard';
import EditorPeticao from '@/components/peticoes/EditorPeticao';
import PremiumAlert from '@/components/peticoes/PremiumAlert';
import HelpSection from '@/components/peticoes/HelpSection';
import EmptyPeticoes from '@/components/peticoes/EmptyPeticoes';

// Import data and utilities
import { peticoesModelo } from '@/data/peticoes-modelo';
import { initializeLocalStorage } from '@/utils/localStorage';

const Peticoes = () => {
  const navigate = useNavigate();
  const [selectedModeloId, setSelectedModeloId] = useState<number | null>(null);
  const [selectedPeticaoId, setSelectedPeticaoId] = useState<number | null>(null);
  const [view, setView] = useState<'list' | 'editor' | 'new'>('list');
  const [peticoesRecentes, setPeticoesRecentes] = useState<any[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  
  // Carrega dados do localStorage
  useEffect(() => {
    initializeLocalStorage();
    const storedPeticoes = localStorage.getItem('peticoesRecentes');
    if (storedPeticoes) {
      setPeticoesRecentes(JSON.parse(storedPeticoes));
    }
    
    const userPremium = localStorage.getItem('userPremium') === 'true';
    setIsPremium(userPremium);
  }, []);
  
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
    let updatedPeticoes = [...peticoesRecentes];
    const existingIndex = updatedPeticoes.findIndex(p => p.id === data.id);
    
    if (existingIndex >= 0) {
      // Atualiza petição existente
      updatedPeticoes[existingIndex] = data;
    } else {
      // Adiciona nova petição
      updatedPeticoes.unshift(data);
      
      // Incrementa contador para usuários não premium
      if (!isPremium) {
        const count = parseInt(localStorage.getItem('peticoesCount') || '0');
        localStorage.setItem('peticoesCount', String(count + 1));
      }
    }
    
    setPeticoesRecentes(updatedPeticoes);
    localStorage.setItem('peticoesRecentes', JSON.stringify(updatedPeticoes));
    
    toast.success(`Petição ${data.status === 'finalizada' ? 'finalizada' : 'salva como rascunho'} com sucesso!`);
    handleVoltar();
  };

  const handleLogout = () => {
    // Implementação simples de logout
    localStorage.removeItem('userPremium');
    localStorage.setItem('peticoesCount', '0');
    toast.success('Logout realizado com sucesso!');
    navigate('/');
  };

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

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-juriscalc-navy">Petições</h1>
          <div className="flex space-x-3">
            <Button 
              className="bg-juriscalc-gold text-juriscalc-navy hover:bg-opacity-90"
              onClick={handleNovaPeticao}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Petição
            </Button>
            <Button 
              variant="outline" 
              className="border-juriscalc-navy text-juriscalc-navy"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>

        {!isPremium && <PremiumAlert />}

        <Tabs defaultValue="recentes" className="mb-8">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="recentes" className="flex-1">Petições Recentes</TabsTrigger>
            <TabsTrigger value="modelos" className="flex-1">Modelos de Petição</TabsTrigger>
          </TabsList>

          <TabsContent value="recentes">
            {peticoesRecentes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {peticoesRecentes.map((peticao) => (
                  <PeticaoRecenteCard 
                    key={peticao.id} 
                    peticao={peticao} 
                    onEditPeticao={handleEditPeticao}
                  />
                ))}
              </div>
            ) : (
              <EmptyPeticoes />
            )}
          </TabsContent>
          
          <TabsContent value="modelos">
            <div className="mb-6">
              <h2 className="text-xl font-serif font-semibold mb-4 text-juriscalc-navy">Modelos Disponíveis</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {peticoesModelo.map((modelo) => (
                  <ModeloCard 
                    key={modelo.id} 
                    modelo={modelo} 
                    onUseModelo={handleUseModelo}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <HelpSection />
      </div>
    </Layout>
  );
};

export default Peticoes;
