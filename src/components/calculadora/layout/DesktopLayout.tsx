
import React, { useEffect } from 'react';
import DadosContratoForm from '@/components/calculadora/DadosContratoForm';
import AdicionaisForm from '@/components/calculadora/AdicionaisForm';
import ResultadosCalculos from '@/components/calculadora/ResultadosCalculos';
import CalculosSalvos from '@/components/calculadora/CalculosSalvos';
import ShareOptionsButton from '@/components/calculadora/share/ShareOptionsButton';
import { Button } from '@/components/ui/button';

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
  aplicarCorrecaoMonetaria: (valorCorrigido: number) => void;
  onShowCorrecaoMonetaria?: () => void;
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
  handleLoadCalculo
}) => {
  // Forçar atualização dos cálculos salvos quando o componente for montado
  useEffect(() => {
    window.dispatchEvent(new Event('calculosSalvosUpdated'));
  }, []);

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
        <div className="mt-4">
          <Button
            onClick={handleCalcularClick}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Calcular
          </Button>
        </div>
      </div>
      <div>
        <ResultadosCalculos 
          resultados={resultados} 
          adicionais={adicionais}
          dadosContrato={dadosContrato}
        />

        {/* Cálculos Salvos agora SEMPRE visíveis, independente de hasCalculos */}
        <CalculosSalvos
          totalGeral={totalGeral}
          dadosContrato={dadosContrato} 
          resultados={resultados}
          onLoadCalculo={handleLoadCalculo}
        />
      </div>
    </div>
  );
};

export default DesktopLayout;
