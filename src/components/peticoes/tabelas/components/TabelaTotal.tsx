
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
    <div className="bg-[#0f172a] p-4 rounded-md text-white border border-[#0f172a] print:bg-[#0f172a] print:text-white print:border-[#0f172a]">
      <div className="text-center">
        <p className="text-sm font-medium mb-2 uppercase print:font-bold print:text-white valor-total-reclamacao">VALOR TOTAL DA RECLAMAÇÃO</p>
        <p className="text-2xl font-bold valor-total-valor print:text-white">
          {formatarMoeda(totalGeral)}
        </p>
      </div>
    </div>
  );
};

export default TabelaTotal;
