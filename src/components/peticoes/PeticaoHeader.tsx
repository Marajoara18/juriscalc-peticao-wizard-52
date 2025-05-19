
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface PeticaoHeaderProps {
  titulo: string;
  onVoltar: () => void;
  rightContent?: React.ReactNode;
}

const PeticaoHeader: React.FC<PeticaoHeaderProps> = ({ titulo, onVoltar, rightContent }) => {
  return (
    <div className="flex justify-between items-center mb-6 print:hidden">
      <div className="flex items-center gap-4">
        <Button 
          onClick={onVoltar} 
          variant="outline" 
          size="sm" 
          className="h-9 w-9 p-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-serif">{titulo}</h1>
      </div>
      {rightContent}
    </div>
  );
};

export default PeticaoHeader;
