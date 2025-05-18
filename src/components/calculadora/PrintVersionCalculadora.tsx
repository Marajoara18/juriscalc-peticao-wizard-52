
import React from 'react';
import TabelaCalculos from '@/components/peticoes/TabelaCalculos';

interface PrintVersionCalculadoraProps {
  resultados: any;
}

const PrintVersionCalculadora: React.FC<PrintVersionCalculadoraProps> = ({ resultados }) => {
  // Não renderizar nada se não houver resultados
  if (!resultados || (!resultados.verbasRescisorias && !resultados.adicionais)) {
    return null;
  }

  // Dados necessários para o demonstrativo
  const calculos = {
    ...resultados,
    timestamp: new Date().toISOString(),
    nomeEscritorio: localStorage.getItem('userName') || 'IusCalc',
  };

  return (
    <div className="hidden print:block print:p-0">
      <TabelaCalculos
        calculos={calculos}
        onInserirNoPeticao={() => {}}
        embutido={true}
      />
    </div>
  );
};

export default PrintVersionCalculadora;
