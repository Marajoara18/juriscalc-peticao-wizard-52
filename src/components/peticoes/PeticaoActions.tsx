
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Printer, FileText } from 'lucide-react';

interface PeticaoActionsProps {
  onSaveRascunho: () => void;
  onSaveFinalized: () => void;
  onPrint: () => void;
  isFinalized?: boolean;
}

const PeticaoActions: React.FC<PeticaoActionsProps> = ({ 
  onSaveRascunho, 
  onSaveFinalized, 
  onPrint,
  isFinalized = false
}) => {
  return (
    <div className="pt-4 flex justify-end space-x-4 print:hidden">
      <Button 
        variant="outline"
        onClick={onPrint}
        className="border-juriscalc-navy text-juriscalc-navy hover:bg-juriscalc-navy hover:text-white"
      >
        <Printer className="mr-2 h-4 w-4" />
        Imprimir Apenas a Petição
      </Button>
      
      {!isFinalized && (
        <>
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
        </>
      )}
      
      {isFinalized && (
        <Button 
          variant="outline"
          onClick={onSaveRascunho}
          className="border-juriscalc-navy text-juriscalc-navy"
        >
          <Save className="mr-2 h-4 w-4" />
          Salvar como Rascunho
        </Button>
      )}
    </div>
  );
};

export default PeticaoActions;
