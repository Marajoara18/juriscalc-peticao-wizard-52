
import React from 'react';
import TabelaCalculos from '@/components/peticoes/TabelaCalculos';

interface CalculoSalvo {
  id: string;
  nome: string;
  timestamp: string;
  verbasRescisorias: any;
  adicionais: any;
  totalGeral: number;
  userId?: string;
  nomeEscritorio?: string;
  dadosContrato?: {
    dataAdmissao?: string;
    dataDemissao?: string;
    salarioBase?: string;
    tipoRescisao?: 'sem_justa_causa' | 'pedido_demissao' | 'justa_causa' | 'rescisao_indireta';
    diasTrabalhados?: string;
    mesesTrabalhados?: string;
  };
}

interface PreviewCalculoContentProps {
  calculo: CalculoSalvo | null;
}

const PreviewCalculoContent: React.FC<PreviewCalculoContentProps> = ({ calculo }) => {
  if (!calculo) return null;
  
  return (
    <div id="print-content" className="print:block">
      <div className="border rounded-md p-4 print:border-none">
        <div className="print:break-inside-avoid">
          <TabelaCalculos
            calculos={calculo}
            onInserirNoPeticao={() => {}}
            embutido={true}
          />
        </div>
      </div>
    </div>
  );
};

export default PreviewCalculoContent;
