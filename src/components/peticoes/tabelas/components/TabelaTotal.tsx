
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
    <div className="valor-total print:bg-[#1D2D5A] print:text-white print:border-[#1D2D5A]"
         style={{ 
           backgroundColor: '#1D2D5A',
           padding: '10px 20px',
           borderRadius: '10px',
           textAlign: 'center',
           fontFamily: 'Arial, sans-serif',
           marginTop: '20px'
         }}>
      <span className="titulo"
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#FFFFFF',
              textTransform: 'uppercase'
            }}>
        VALOR TOTAL DA RECLAMAÇÃO
      </span>
      <span className="valor"
            style={{
              display: 'block',
              fontSize: '22px',
              fontWeight: 'bold',
              color: '#FFFFFF',
              marginTop: '5px'
            }}>
        {formatarMoeda(totalGeral)}
      </span>
    </div>
  );
};

export default TabelaTotal;
