
import React from 'react';
import { formatarMoeda } from '@/utils/formatters';

interface PrintTotalProps {
  totalGeral: number;
}

const PrintTotal: React.FC<PrintTotalProps> = ({ totalGeral }) => {
  return (
    <div className="bg-[#0f172a] text-white p-4 mb-4 rounded-md print:bg-[#0f172a] print:text-white border border-[#0f172a]">
      <div className="text-center">
        <p className="text-sm font-medium mb-2 uppercase print:font-bold print:text-white valor-total-reclamacao">VALOR TOTAL DA RECLAMAÇÃO</p>
        <p className="text-2xl font-bold valor-total-valor print:text-white">
          {formatarMoeda(totalGeral)}
        </p>
      </div>
    </div>
  );
};

export default PrintTotal;
