
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react'; // Changed FilePdf to FileText
import ExportDropdown from '@/components/calculadora/ExportDropdown';
import PreviewCalculoContent from './PreviewCalculoContent';
import { exportToPDF } from '@/utils/exportUtils';

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
  const handleExportPDF = () => {
    exportToPDF();
    // Não feche o diálogo para permitir que o usuário continue vendo o conteúdo
  };

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
        <DialogFooter className="print:hidden flex flex-wrap gap-2 justify-end sm:justify-between">
          <Button 
            variant="outline" 
            onClick={handleExportPDF}
            className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
          >
            <FileText className="h-4 w-4 mr-2" /> {/* Changed FilePdf to FileText */}
            Exportar como PDF
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
            <ExportDropdown 
              data={calculo || undefined} 
              onClose={() => onOpenChange(false)}
            />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewCalculoDialog;
