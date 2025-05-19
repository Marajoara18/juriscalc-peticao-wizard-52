
import React from 'react';
import EmptyPeticoes from '@/components/peticoes/EmptyPeticoes';
import PeticaoRecenteCard from '@/components/peticoes/PeticaoRecenteCard';

interface PeticoesViewsProps {
  peticoesRecentes: any[];
  onUseModelo: (id: number) => void;
  onEditPeticao: (id: number) => void;
  onDeletePeticao: (id: number) => void;
}

const PeticoesViews = ({ peticoesRecentes, onUseModelo, onEditPeticao, onDeletePeticao }: PeticoesViewsProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-serif font-semibold mb-6 text-juriscalc-navy">Petições Recentes</h2>
      
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
    </div>
  );
};

export default PeticoesViews;
