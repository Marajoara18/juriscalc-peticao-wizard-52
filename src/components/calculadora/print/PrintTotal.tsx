
import React from 'react';
import { formatarMoeda } from '@/utils/formatters';

interface PrintTotalProps {
  totalGeral: number;
}

const PrintTotal: React.FC<PrintTotalProps> = ({ totalGeral }) => {
  return (
    <div className="bg-gray-200 text-black p-4 mb-4 rounded-md print:bg-gray-200 print:text-black">
      <div className="text-center">
        <p className="text-sm font-medium mb-2 uppercase print:font-bold valor-total-reclamacao">VALOR TOTAL DA RECLAMAÇÃO</p>
        <p className="text-2xl font-bold valor-total-valor">
          {formatarMoeda(totalGeral)}
        </p>
      </div>
    </div>
  );
};

export default PrintTotal;
