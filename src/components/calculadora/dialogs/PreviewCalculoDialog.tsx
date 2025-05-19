
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import TabelaCalculos from '@/components/peticoes/TabelaCalculos';
import { handlePrint } from '@/utils/peticaoUtils';
import { toast } from "sonner";

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
  const handlePrintCalculo = () => {
    handlePrint();
    toast.success('Demonstrativo de cálculos enviado para impressão!');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader className="print:hidden">
          <DialogTitle>Demonstrativo de Cálculos</DialogTitle>
          <DialogDescription>
            Visualize e imprima o demonstrativo de cálculos
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 print:py-0">
          {calculo && (
            <div id="print-content" className="print:block">
              <div className="border rounded-md p-4 print:border-none">
                <div className="print:break-inside-avoid">
                  <TabelaCalculos
                    calculos={calculo}
                    onInserirNoPeticao={() => {}}
                    embutido={true}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="print:hidden">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button onClick={handlePrintCalculo}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewCalculoDialog;
