import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Share2, Mail, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { 
  exportToPDF, 
  shareViaWhatsApp, 
  shareViaEmail, 
  generateCalculationText 
} from '@/utils/export';

interface ShareOptionsButtonProps {
  resultados: any;
  dadosContrato: any;
  totalGeral: number;
  isMobile?: boolean;
}

const ShareOptionsButton: React.FC<ShareOptionsButtonProps> = ({ 
  resultados, 
  dadosContrato, 
  totalGeral,
  isMobile = false 
}) => {
  // Verificar se há resultados para compartilhar
  if (!resultados || (!resultados.verbasRescisorias && !resultados.adicionais)) {
    return null;
  }

  const handleShareEmail = () => {
    const subject = encodeURIComponent("Cálculos Trabalhistas - IusCalc");
    const body = generateCalculationText(resultados);
    
    shareViaEmail(subject, body);
    toast.success("Preparando e-mail com os cálculos");
  };

  const handleShareWhatsApp = () => {
    // Use the enhanced text generation function for WhatsApp sharing
    const text = generateCalculationText(resultados);
    
    shareViaWhatsApp(text);
    toast.success("Compartilhando cálculos via WhatsApp");
  };

  // Versão mobile (botões em linha)
  if (isMobile) {
    return (
      <div className="flex gap-2 w-full">
        <Button 
          onClick={handleShareEmail}
          className="flex-1 bg-red-600 hover:bg-red-700"
          size="sm"
        >
          <Mail className="mr-2 h-4 w-4" />
          E-mail
        </Button>
        <Button 
          onClick={handleShareWhatsApp}
          className="flex-1 bg-green-600 hover:bg-green-700"
          size="sm"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          WhatsApp
        </Button>
      </div>
    );
  }

  // Versão desktop (menu dropdown)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-juriscalc-navy text-juriscalc-navy">
          <Share2 className="mr-2 h-4 w-4" />
          Compartilhar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Opções de Compartilhamento</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleShareEmail}>
          <Mail className="mr-2 h-4 w-4" />
          Compartilhar por E-mail
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShareWhatsApp}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Compartilhar via WhatsApp
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareOptionsButton;
