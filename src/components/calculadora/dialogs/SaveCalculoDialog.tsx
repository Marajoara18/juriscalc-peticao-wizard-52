
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Printer } from "lucide-react";
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Cálculo' : 'Salvar Cálculo'}</DialogTitle>
          <DialogDescription>Dê um nome descritivo para identificar este cálculo posteriormente.</DialogDescription>
        </DialogHeader>
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
