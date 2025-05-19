
import React from 'react';
import { formatarMoeda } from '@/utils/formatters';

interface PrintTotalProps {
  totalGeral: number;
}

const PrintTotal: React.FC<PrintTotalProps> = ({ totalGeral }) => {
  return (
    <div className="bg-gray-200 text-black p-4 mb-4 rounded-md print:bg-gray-200 print:text-black">
      <div className="flex justify-between">
        <span className="font-bold">TOTAL GERAL</span>
        <span className="font-bold">{formatarMoeda(totalGeral)}</span>
      </div>
    </div>
  );
};

export default PrintTotal;
