
import React from 'react';
import { formatarMoeda } from '@/utils/formatters';

interface PrintSubtotalProps {
  totalGeral: number;
}

const PrintSubtotal: React.FC<PrintSubtotalProps> = ({ totalGeral }) => {
  return (
    <div className="flex justify-between mb-4">
      <span className="font-medium">
        Subtotal
      </span>
      <span className="font-medium">{formatarMoeda(totalGeral)}</span>
    </div>
  );
};

export default PrintSubtotal;
