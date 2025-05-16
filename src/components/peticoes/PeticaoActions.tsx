
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Printer } from 'lucide-react';

interface PeticaoActionsProps {
  onSaveRascunho: () => void;
  onSaveFinalized: () => void;
  onPrint: () => void;
}

const PeticaoActions: React.FC<PeticaoActionsProps> = ({ onSaveRascunho, onSaveFinalized, onPrint }) => {
  return (
    <div className="pt-4 flex justify-end space-x-4 print:hidden">
      <Button 
        variant="outline"
        onClick={onPrint}
        className="border-juriscalc-navy text-juriscalc-navy hover:bg-juriscalc-navy hover:text-white"
      >
        <Printer className="mr-2 h-4 w-4" />
        Imprimir Petição
      </Button>
      <Button 
        variant="outline"
        onClick={onSaveRascunho}
      >
        <Save className="mr-2 h-4 w-4" />
        Salvar Rascunho
      </Button>
      <Button 
        className="bg-juriscalc-navy" 
        onClick={onSaveFinalized}
      >
        Finalizar Petição
      </Button>
    </div>
  );
};

export default PeticaoActions;
