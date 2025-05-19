
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Share2, Mail, MessageCircle } from 'lucide-react';
import { toast } from "sonner";

interface SharePeticaoButtonProps {
  titulo: string;
  id: number | string;
  isFinalized?: boolean;
}

const SharePeticaoButton: React.FC<SharePeticaoButtonProps> = ({ 
  titulo, 
  id,
  isFinalized = true 
}) => {
  if (!isFinalized) {
    return (
      <Button 
        variant="outline" 
        className="text-gray-400 border-gray-300 hover:bg-gray-100"
        disabled
        title="Finalize a petição para compartilhar"
      >
        <Share2 className="h-4 w-4 mr-2" />
        Compartilhar
      </Button>
    );
  }

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Petição: ${titulo}`);
    const body = encodeURIComponent(`
      Olá,
      
      Segue a petição "${titulo}" criada no IusCalc.
      
      Para visualizar a petição completa, acesse o IusCalc com o ID: ${id}
      
      Atenciosamente,
    `);
    
    window.open(`mailto:?subject=${subject}&body=${body}`);
    toast.success("Preparando e-mail com a petição");
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`
      *Petição: ${titulo}*
      
      Criada no IusCalc
      
      Para visualizar a petição completa, acesse o IusCalc com o ID: ${id}
    `);
    
    window.open(`https://wa.me/?text=${text}`);
    toast.success("Compartilhando petição via WhatsApp");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-juriscalc-navy text-juriscalc-navy">
          <Share2 className="mr-2 h-4 w-4" />
          Compartilhar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleShareEmail}>
          <Mail className="mr-2 h-4 w-4" />
          Compartilhar por E-mail
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleShareWhatsApp}>
          <MessageCircle className="mr-2 h-4 w-4" />
          Compartilhar via WhatsApp
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SharePeticaoButton;
