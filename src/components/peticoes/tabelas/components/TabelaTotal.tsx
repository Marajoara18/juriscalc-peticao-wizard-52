
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
    <div className="bg-white p-4 rounded-md text-black border border-gray-300 print:bg-white print:text-black print:border-gray-300">
      <div className="text-center">
        <p className="text-sm font-medium mb-2 uppercase print:font-bold valor-total-reclamacao">VALOR TOTAL DA RECLAMAÇÃO</p>
        <p className="text-2xl font-bold valor-total-valor">
          {formatarMoeda(totalGeral)}
        </p>
      </div>
    </div>
  );
};

export default TabelaTotal;
