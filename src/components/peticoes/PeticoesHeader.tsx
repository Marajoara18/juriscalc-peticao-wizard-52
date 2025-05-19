
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PeticoesHeaderProps {
  onNewPeticao: () => void;
  onUserClick: () => void;
}

const PeticoesHeader = ({ onNewPeticao, onUserClick }: PeticoesHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-serif font-bold text-juriscalc-navy">Petições</h1>
      <div className="flex space-x-3">
        <Button 
          className="bg-juriscalc-gold text-juriscalc-navy hover:bg-opacity-90"
          onClick={onNewPeticao}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Petição
        </Button>
      </div>
    </div>
  );
};

export default PeticoesHeader;
