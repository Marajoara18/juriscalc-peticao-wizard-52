
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import PeticoesHeader from '@/components/peticoes/PeticoesHeader';
import PeticoesViews from '@/components/peticoes/PeticoesViews';
import PremiumAlert from '@/components/peticoes/PremiumAlert';
import HelpSection from '@/components/peticoes/HelpSection';
import { usePeticoes } from '@/contexts/PeticoesContext';

const ListView = () => {
  const { 
    peticoesRecentes, 
    isPremium, 
    isViewingAsUser, 
    viewingBanner,
    handleNovaPeticao, 
    handleUseModelo, 
    handleEditPeticao, 
    handleDeletePeticao, 
    handleUserClick, 
    handleStopViewingAs 
  } = usePeticoes();

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

export default ListView;
