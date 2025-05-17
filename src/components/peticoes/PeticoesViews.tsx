
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmptyPeticoes from '@/components/peticoes/EmptyPeticoes';
import ModeloCard from '@/components/peticoes/ModeloCard';
import PeticaoRecenteCard from '@/components/peticoes/PeticaoRecenteCard';
import { peticoesModelo } from '@/data/peticoes-modelo';

interface PeticoesViewsProps {
  peticoesRecentes: any[];
  onUseModelo: (id: number) => void;
  onEditPeticao: (id: number) => void;
  onDeletePeticao: (id: number) => void;
}

const PeticoesViews = ({ peticoesRecentes, onUseModelo, onEditPeticao, onDeletePeticao }: PeticoesViewsProps) => {
  return (
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
                onEditPeticao={onEditPeticao}
                onDeletePeticao={onDeletePeticao}
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
                onUseModelo={onUseModelo}
              />
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default PeticoesViews;
