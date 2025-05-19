
import React from 'react';
import { formatarMoeda } from '@/utils/formatters';

interface PrintTotalProps {
  totalGeral: number;
}

const PrintTotal: React.FC<PrintTotalProps> = ({ totalGeral }) => {
  return (
    <div className="valor-total">
      <span className="titulo">VALOR TOTAL DA RECLAMAÇÃO</span>
      <span className="valor">{formatarMoeda(totalGeral)}</span>
    </div>
  );
};

export default PrintTotal;
