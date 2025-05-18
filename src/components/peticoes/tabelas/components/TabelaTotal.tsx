
import React from 'react';
import { formatarMoeda } from '@/utils/formatters';

interface TabelaTotalProps {
  totalGeral: number;
  tipoRescisao?: string;
}

const TabelaTotal: React.FC<TabelaTotalProps> = ({ 
  totalGeral, 
  tipoRescisao = 'sem_justa_causa' 
}) => {
  // Descrição baseada no tipo de rescisão
  const getDescricaoRescisao = () => {
    switch (tipoRescisao) {
      case 'sem_justa_causa':
        return "Valor a receber por demissão sem justa causa";
      case 'pedido_demissao':
        return "Valor a receber por pedido de demissão";
      case 'justa_causa':
        return "Valor a receber por demissão com justa causa";
      case 'rescisao_indireta':
        return "Valor a receber por rescisão indireta";
      default:
        return "Valor Total da Reclamação";
    }
  };

  return (
    <div className="bg-juriscalc-navy p-4 rounded-md text-white">
      <div className="text-center">
        <p className="text-sm font-medium mb-2">{getDescricaoRescisao()}</p>
        <p className="text-2xl font-bold">
          {formatarMoeda(totalGeral)}
        </p>
      </div>
    </div>
  );
};

export default TabelaTotal;
