
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Printer, AlertCircle, RefreshCw } from "lucide-react";
import { handlePrint } from '@/utils/peticaoUtils';
import { toast } from "sonner";

interface SaveCalculoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nomeCalculo: string;
  setNomeCalculo: (nome: string) => void;
  isEditing: boolean;
  onSave: () => void;
}

const SaveCalculoDialog: React.FC<SaveCalculoDialogProps> = ({
  open,
  onOpenChange,
  nomeCalculo,
  setNomeCalculo,
  isEditing,
  onSave
}) => {
  const handlePrintCalculo = () => {
    handlePrint();
    toast.success('Demonstrativo de cálculos enviado para impressão!');
  };

  const handleRetryAfterCache = () => {
    toast.info('Aguardando cache do sistema atualizar...');
    setTimeout(() => {
      onSave();
    }, 3000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Cálculo' : 'Salvar Cálculo'}</DialogTitle>
          <DialogDescription>Dê um nome descritivo para identificar este cálculo posteriormente.</DialogDescription>
        </DialogHeader>

        {!isEditing && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 text-sm mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-yellow-700">
                  Atenção: Você pode salvar no máximo 3 cálculos. Para adicionar novos, você precisará apagar cálculos existentes ou fazer upgrade para o plano premium.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 text-sm mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <RefreshCw className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-blue-700">
                Se aparecer erro de sistema, aguarde alguns segundos e tente novamente. O sistema pode estar atualizando o cache.
              </p>
            </div>
          </div>
        </div>

        <div className="py-4">
          <label className="block text-sm font-medium mb-2" htmlFor="nome-calculo">
            Nome do Cálculo
          </label>
          <Input 
            id="nome-calculo"
            value={nomeCalculo}
            onChange={(e) => setNomeCalculo(e.target.value)}
            placeholder="Ex: Cálculo Empresa XYZ"
            className="w-full"
            autoFocus
          />
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handlePrintCalculo}
            className="mr-auto"
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button 
            variant="outline" 
            onClick={handleRetryAfterCache}
            className="mr-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar em 3s
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSave}>
            {isEditing ? 'Atualizar' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveCalculoDialog;
