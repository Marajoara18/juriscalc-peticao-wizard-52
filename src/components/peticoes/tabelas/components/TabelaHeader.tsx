
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CardTitle, CardDescription } from "@/components/ui/card";

interface TabelaHeaderProps {
  onInserirNoPeticao: () => void;
  logoUrl?: string | null;
  nomeCalculo: string;
  dataCalculo: string;
  tipoRescisao?: string;
}

const TabelaHeader: React.FC<TabelaHeaderProps> = ({
  onInserirNoPeticao,
  logoUrl,
  nomeCalculo,
  dataCalculo,
  tipoRescisao = 'sem_justa_causa'
}) => {
  // Obter o texto descritivo do tipo de rescisão
  const getTipoRescisaoTexto = () => {
    switch (tipoRescisao) {
      case 'sem_justa_causa':
        return "Demissão Sem Justa Causa";
      case 'pedido_demissao':
        return "Pedido de Demissão";
      case 'justa_causa':
        return "Demissão por Justa Causa";
      case 'rescisao_indireta':
        return "Rescisão Indireta";
      default:
        return "Rescisão de Contrato";
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <img 
          src="/lovable-uploads/caf683c7-0cb3-4ef4-8e5f-5de22f996b8a.png"
          alt="IusCalc Logo" 
          className="h-10 mr-3" 
        />
        <div>
          <CardTitle className="text-xl">Cálculos Trabalhistas</CardTitle>
          <CardDescription>
            {nomeCalculo}
            {getTipoRescisaoTexto()} - Gerado em: {dataCalculo}
          </CardDescription>
        </div>
      </div>
      <Button 
        onClick={onInserirNoPeticao} 
        className="bg-juriscalc-gold text-juriscalc-navy hover:bg-opacity-90"
      >
        <Plus className="mr-2 h-4 w-4" />
        Inserir na Petição
      </Button>
    </div>
  );
};

export default TabelaHeader;
