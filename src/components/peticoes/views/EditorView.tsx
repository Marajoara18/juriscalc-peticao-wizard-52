
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import EditorPeticao from '@/components/peticoes/EditorPeticao';
import { usePeticoes } from '@/contexts/PeticoesContext';
import { peticoesModelo } from '@/data/peticoes-modelo';

const EditorView = () => {
  const { 
    selectedModeloId, 
    selectedPeticaoId, 
    peticoesRecentes, 
    handleVoltar, 
    handleSavePeticao, 
    isViewingAsUser, 
    viewingBanner,
    handleStopViewingAs 
  } = usePeticoes();

  const selectedModelo = peticoesModelo.find(m => m.id === selectedModeloId);
  const selectedPeticao = peticoesRecentes.find(p => p.id === selectedPeticaoId);

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
};

export default EditorView;
