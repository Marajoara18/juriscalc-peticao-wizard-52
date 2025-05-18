
import React from 'react';
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { handlePrint } from '@/utils/peticaoUtils';
import { toast } from "sonner";

interface PrintResultButtonProps {
  disabled?: boolean;
}

const PrintResultButton: React.FC<PrintResultButtonProps> = ({ disabled = false }) => {
  const handlePrintClick = () => {
    handlePrint();
    toast.success('Demonstrativo de cálculos enviado para impressão!');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handlePrintClick}
      disabled={disabled}
      className="gap-2"
    >
      <Printer className="h-4 w-4" />
      Imprimir Resultados
    </Button>
  );
};

export default PrintResultButton;
