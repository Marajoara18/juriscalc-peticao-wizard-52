
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface PeticaoHeaderProps {
  titulo: string;
  onVoltar: () => void;
}

const PeticaoHeader: React.FC<PeticaoHeaderProps> = ({ titulo, onVoltar }) => {
  return (
    <div className="mb-6 flex items-center print:hidden">
      <Button variant="ghost" onClick={onVoltar} className="mr-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>
      <h2 className="text-2xl font-serif font-semibold">{titulo}</h2>
    </div>
  );
};

export default PeticaoHeader;
