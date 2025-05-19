
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
  return (
    <div className="bg-juriscalc-navy p-4 rounded-md text-white">
      <div className="text-center">
        <p className="text-sm font-medium mb-2 uppercase">VALOR TOTAL DA RECLAMAÇÃO</p>
        <p className="text-2xl font-bold">
          {formatarMoeda(totalGeral)}
        </p>
      </div>
    </div>
  );
};

export default TabelaTotal;
