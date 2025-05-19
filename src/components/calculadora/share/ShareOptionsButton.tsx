
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
import { Share2, FilePdf, Mail, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { exportToPDF } from '@/utils/exportUtils';

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

  const handleExportPDF = () => {
    exportToPDF();
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent("Cálculos Trabalhistas - IusCalc");
    const body = encodeURIComponent(`
      Olá,
      
      Segue o demonstrativo de cálculos trabalhistas gerado pelo IusCalc.
      
      Valor total da reclamação: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalGeral)}
      
      Acesse o IusCalc para mais cálculos: https://iuscalc.com
    `);
    
    window.open(`mailto:?subject=${subject}&body=${body}`);
    toast.success("Preparando e-mail com os cálculos");
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`
      *Cálculos Trabalhistas - IusCalc*
      
      Demonstrativo de cálculos trabalhistas
      
      Valor total da reclamação: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalGeral)}
      
      Acesse o IusCalc para mais cálculos: https://iuscalc.com
    `);
    
    window.open(`https://wa.me/?text=${text}`);
    toast.success("Compartilhando cálculos via WhatsApp");
  };

  // Versão mobile (botões em linha)
  if (isMobile) {
    return (
      <div className="flex gap-2 w-full">
        <Button 
          onClick={handleExportPDF} 
          className="flex-1 bg-juriscalc-navy hover:bg-opacity-90"
          size="sm"
        >
          <FilePdf className="mr-2 h-4 w-4" />
          PDF
        </Button>
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
          <MessageCircle className="mr-2 h-4 w-4" />
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
        <DropdownMenuItem onClick={handleExportPDF}>
          <FilePdf className="mr-2 h-4 w-4" />
          Exportar como PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShareEmail}>
          <Mail className="mr-2 h-4 w-4" />
          Compartilhar por E-mail
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShareWhatsApp}>
          <MessageCircle className="mr-2 h-4 w-4" />
          Compartilhar via WhatsApp
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareOptionsButton;
