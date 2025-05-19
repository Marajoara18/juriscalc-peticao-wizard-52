
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

  // Calcular o total geral (soma das verbas rescisórias e adicionais)
  const totalVerbas = resultados.verbasRescisorias?.total || 0;
  const totalAdicionais = Object.values(resultados.adicionais || {}).reduce(
    (sum: number, valor: any) => sum + (typeof valor === 'number' ? valor : 0), 
    0
  );
  const totalGeral = totalVerbas + totalAdicionais;

  // Dados necessários para o demonstrativo
  const calculos = {
    ...resultados,
    totalGeral,
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
