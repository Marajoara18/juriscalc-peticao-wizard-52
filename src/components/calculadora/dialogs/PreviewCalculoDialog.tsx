
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ExportDropdown from '@/components/calculadora/ExportDropdown';
import PreviewCalculoContent from './PreviewCalculoContent';

interface CalculoSalvo {
  id: string;
  nome: string;
  timestamp: string;
  verbasRescisorias: any;
  adicionais: any;
  totalGeral: number;
  userId?: string;
  nomeEscritorio?: string;
  dadosContrato?: {
    dataAdmissao?: string;
    dataDemissao?: string;
    salarioBase?: string;
    tipoRescisao?: 'sem_justa_causa' | 'pedido_demissao' | 'justa_causa' | 'rescisao_indireta';
    diasTrabalhados?: string;
    mesesTrabalhados?: string;
  };
}

interface PreviewCalculoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calculo: CalculoSalvo | null;
}

const PreviewCalculoDialog: React.FC<PreviewCalculoDialogProps> = ({
  open,
  onOpenChange,
  calculo
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader className="print:hidden">
          <DialogTitle>Demonstrativo de Cálculos</DialogTitle>
          <DialogDescription>
            Visualize e exporte o demonstrativo de cálculos
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 print:py-0">
          {calculo && <PreviewCalculoContent calculo={calculo} />}
        </div>
        <DialogFooter className="print:hidden">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <ExportDropdown 
            data={calculo || undefined} 
            onClose={() => onOpenChange(false)}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewCalculoDialog;
