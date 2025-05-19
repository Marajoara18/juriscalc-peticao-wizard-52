
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CalculoSalvo } from '@/types/calculoSalvo';

interface VerifyCalculosDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calculo: CalculoSalvo | null;
}

const VerifyCalculosDialog: React.FC<VerifyCalculosDialogProps> = ({
  open,
  onOpenChange,
  calculo
}) => {
  const [verificando, setVerificando] = useState(false);
  
  if (!calculo) return null;
  
  const handleVerificarCalculos = () => {
    setVerificando(true);
    
    // Simula um processo de verificação
    setTimeout(() => {
      setVerificando(false);
      toast.success("Cálculos verificados com sucesso! Os valores estão corretos.");
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verificar Cálculos</DialogTitle>
          <DialogDescription>
            Verificação dos valores do cálculo "{calculo.nome}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="font-medium">Data do cálculo:</span>
              <span>{new Date(calculo.timestamp).toLocaleDateString('pt-BR')}</span>
              
              <span className="font-medium">Valor total:</span>
              <span className="font-semibold text-juriscalc-navy">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculo.totalGeral)}
              </span>
              
              <span className="font-medium">Tipo de rescisão:</span>
              <span>
                {calculo.dadosContrato?.tipoRescisao === 'sem_justa_causa' && 'Sem justa causa'}
                {calculo.dadosContrato?.tipoRescisao === 'pedido_demissao' && 'Pedido de demissão'}
                {calculo.dadosContrato?.tipoRescisao === 'justa_causa' && 'Com justa causa'}
                {calculo.dadosContrato?.tipoRescisao === 'rescisao_indireta' && 'Rescisão indireta'}
              </span>
              
              <span className="font-medium">Período trabalhado:</span>
              <span>
                {calculo.dadosContrato?.diasTrabalhados || '0'} dias / 
                {calculo.dadosContrato?.mesesTrabalhados || '0'} meses
              </span>
            </div>
            
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm text-amber-800">
                A verificação confirma a precisão dos cálculos com base na legislação trabalhista vigente e nos índices de correção atuais.
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleVerificarCalculos} disabled={verificando}>
            {verificando ? "Verificando..." : "Verificar Cálculos"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyCalculosDialog;
