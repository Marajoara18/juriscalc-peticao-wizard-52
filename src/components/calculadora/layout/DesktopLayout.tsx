import React from 'react';
import DadosContratoForm from '@/components/calculadora/DadosContratoForm';
import AdicionaisForm from '@/components/calculadora/AdicionaisForm';
import ResultadosSection from '@/components/calculadora/ResultadosSection';
import CorrecaoMonetaria from '@/components/calculadora/CorrecaoMonetaria';
import SalvarCalculoModal from '@/components/calculadora/SalvarCalculoModal';

interface CalculadoraLayoutProps {
  dadosContrato: any;
  adicionais: any;
  resultados: any;
  showCorrecaoMonetaria: boolean;
  hasCalculos: boolean;
  totalGeral: number;
  handleDadosContratoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCheckboxChange: (field: string, checked: boolean) => void;
  handleTipoRescisaoChange: (value: string) => void;
  handleAdicionaisChange: (name: string, value: string | boolean | any) => void;
  handleCalcularClick: () => void;
  handleLoadCalculo: (calculo: any) => void;
  setShowCorrecaoMonetaria: (show: boolean) => void;
  aplicarCorrecaoMonetaria: () => void;
}

const DesktopLayout: React.FC<CalculadoraLayoutProps> = ({
  dadosContrato,
  adicionais,
  resultados,
  showCorrecaoMonetaria,
  hasCalculos,
  totalGeral,
  handleDadosContratoChange,
  handleCheckboxChange,
  handleTipoRescisaoChange,
  handleAdicionaisChange,
  handleCalcularClick,
  handleLoadCalculo,
  setShowCorrecaoMonetaria,
  aplicarCorrecaoMonetaria
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <div className="mb-4">
          <DadosContratoForm 
            dadosContrato={dadosContrato}
            onChange={handleDadosContratoChange}
            onCheckboxChange={handleCheckboxChange}
            onTipoRescisaoChange={handleTipoRescisaoChange}
          />
        </div>
        <div>
          <AdicionaisForm 
            adicionais={adicionais} 
            dadosContrato={dadosContrato}
            onChange={handleAdicionaisChange} 
          />
        </div>
      </div>
      <div>
        <ResultadosSection resultados={resultados} />

        {hasCalculos && (
          <>
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setShowCorrecaoMonetaria(!showCorrecaoMonetaria)}
                className="text-sm text-blue-500 hover:underline"
              >
                {showCorrecaoMonetaria ? 'Ocultar Correção Monetária' : 'Aplicar Correção Monetária'}
              </button>

              <SalvarCalculoModal totalGeral={totalGeral} dadosContrato={dadosContrato} adicionais={adicionais} resultados={resultados} />
            </div>

            {showCorrecaoMonetaria && (
              <CorrecaoMonetaria
                resultados={resultados}
                aplicarCorrecaoMonetaria={aplicarCorrecaoMonetaria}
              />
            )}
          </>
        )}

        {!hasCalculos && (
          <div className="mt-4">
            <button
              onClick={handleCalcularClick}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Calcular
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopLayout;
