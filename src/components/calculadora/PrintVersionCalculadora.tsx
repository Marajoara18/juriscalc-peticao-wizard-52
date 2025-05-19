
import React from 'react';
import PrintHeader from './print/PrintHeader';
import PrintVerbasRescisorias from './print/PrintVerbasRescisorias';
import PrintAdicionais from './print/PrintAdicionais';
import PrintSubtotal from './print/PrintSubtotal';
import PrintTotal from './print/PrintTotal';

interface PrintVersionCalculadoraProps {
  resultados: any;
  dadosContrato?: any;
}

const PrintVersionCalculadora: React.FC<PrintVersionCalculadoraProps> = ({ resultados, dadosContrato }) => {
  // Não renderizar nada se não houver resultados
  if (!resultados || (!resultados.verbasRescisorias && !resultados.adicionais)) {
    return null;
  }

  // Calcular o total geral (soma das verbas rescisórias e adicionais)
  const verbas = resultados.verbasRescisorias || {};
  const adicionais = resultados.adicionais || {};
  
  const totalVerbas = verbas.total || 0;
  const totalAdicionais = Object.entries(adicionais)
    .filter(([key, value]) => typeof value === 'number' && value > 0 && key !== 'total' && key !== 'honorariosAdvocaticios')
    .reduce((sum, [_, value]) => sum + (value as number), 0);
  
  const totalGeral = totalVerbas + totalAdicionais;

  return (
    <div className="hidden print:block print:p-4" id="print-content-calculadora">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-center text-xl font-bold mb-4">Calculadora de Verbas Trabalhistas</h2>
        
        {/* Dados de Entrada */}
        {dadosContrato && <PrintHeader dadosContrato={dadosContrato} />}
        
        {/* Resultados do Cálculo */}
        <div className="mb-6 border rounded-md p-4">
          <h3 className="text-lg font-bold mb-4">Resultados do Cálculo</h3>
          
          {/* Verbas Rescisórias */}
          <PrintVerbasRescisorias verbas={verbas} />
          
          {/* Adicionais e Multas - apenas se houver */}
          <PrintAdicionais adicionais={adicionais} />
          
          {/* Subtotal */}
          <PrintSubtotal totalGeral={totalGeral} />
          
          {/* Valor Total */}
          <PrintTotal totalGeral={totalGeral} />
        </div>
      </div>
    </div>
  );
};

export default PrintVersionCalculadora;
