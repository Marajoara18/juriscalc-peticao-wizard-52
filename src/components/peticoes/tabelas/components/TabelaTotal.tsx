
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
    <div className="valor-total">
      <span className="titulo">VALOR TOTAL DA RECLAMAÇÃO</span>
      <span className="valor">{formatarMoeda(totalGeral)}</span>
    </div>
  );
};

export default TabelaTotal;
