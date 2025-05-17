
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatarMoeda } from '@/utils/formatters';

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

interface ConfirmPeticaoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calculo: CalculoSalvo | null;
  onConfirm: () => void;
}

const ConfirmPeticaoDialog: React.FC<ConfirmPeticaoDialogProps> = ({
  open,
  onOpenChange,
  calculo,
  onConfirm
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Usar Cálculo na Petição</DialogTitle>
          <DialogDescription>
            Este cálculo será disponibilizado para uso na próxima petição que você criar ou editar.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-2">
            <strong>Nome:</strong> {calculo?.nome}
          </p>
          <p className="mb-4">
            <strong>Total:</strong> {calculo ? formatarMoeda(calculo.totalGeral) : ''}
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onConfirm}>
            Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmPeticaoDialog;
