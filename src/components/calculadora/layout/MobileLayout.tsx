import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DadosContratoForm from '@/components/calculadora/DadosContratoForm';
import AdicionaisForm from '@/components/calculadora/AdicionaisForm';
import ResultadosCalculos from '@/components/calculadora/ResultadosCalculos';
import CorrecaoMonetaria from '@/components/calculadora/CorrecaoMonetaria';
import CalculosSalvos from '@/components/calculadora/CalculosSalvos';
import { DadosContrato, Adicionais } from '@/types/calculadora';

interface CalculadoraLayoutProps {
  dadosContrato: DadosContrato;
  adicionais: Adicionais;
  resultados: any;
  showCorrecaoMonetaria: boolean;
  hasCalculos: boolean;
  totalGeral: number;
  handleDadosContratoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCheckboxChange: (field: string, checked: boolean) => void;
  handleTipoRescisaoChange: (value: string) => void;
  handleAdicionaisChange: (name: string, value: string | boolean) => void;
  handleCalcularClick: () => void;
  handleLoadCalculo: (calculo: any) => void;
  setShowCorrecaoMonetaria: React.Dispatch<React.SetStateAction<boolean>>;
  aplicarCorrecaoMonetaria: (valorCorrigido: number) => void;
}

const MobileLayout: React.FC<CalculadoraLayoutProps> = ({
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
  const [activeTab, setActiveTab] = useState<'dados' | 'adicionais' | 'resultados'>('dados');
  
  return (
    <div className="space-y-4">
      <div className="flex border-b">
        {/* Form area */}
        <Tabs defaultValue="contrato">
          <TabsList className="w-full">
            <TabsTrigger value="contrato" className="flex-1">Dados do Contrato</TabsTrigger>
            <TabsTrigger value="adicionais" className="flex-1">Adicionais e Multas</TabsTrigger>
          </TabsList>

          <TabsContent value="contrato">
            <DadosContratoForm 
              dadosContrato={dadosContrato}
              onChange={handleDadosContratoChange}
              onCheckboxChange={handleCheckboxChange}
              onTipoRescisaoChange={handleTipoRescisaoChange}
            />
          </TabsContent>

          <TabsContent value="adicionais">
            <AdicionaisForm 
              adicionais={adicionais}
              onChange={handleAdicionaisChange}
            />
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <Button 
          onClick={handleCalcularClick}
          className="w-full bg-juriscalc-navy text-white hover:bg-opacity-90"
          size="lg"
        >
          Calcular Verbas
        </Button>
      </div>

      {/* Results area */}
      <div>
        <ResultadosCalculos 
          resultados={resultados} 
          adicionais={adicionais}
          dadosContrato={dadosContrato}
          onLoadCalculo={handleLoadCalculo}
        />
        
        {/* Mostrar opções pós-cálculo quando os cálculos estiverem prontos */}
        {hasCalculos && (
          <div className="mt-4 space-y-4">
            {/* Opção de correção monetária */}
            {showCorrecaoMonetaria ? (
              <>
                <CorrecaoMonetaria 
                  onAplicarCorrecao={aplicarCorrecaoMonetaria} 
                  totalGeral={totalGeral}
                  dataAdmissao={dadosContrato.dataAdmissao}
                />
                <Button 
                  variant="outline"
                  className="w-full border-juriscalc-navy text-juriscalc-navy mt-2"
                  onClick={() => setShowCorrecaoMonetaria(false)}
                >
                  Ocultar Correção Monetária
                </Button>
              </>
            ) : (
              <Button 
                variant="outline"
                className="w-full border-juriscalc-navy text-juriscalc-navy"
                onClick={() => setShowCorrecaoMonetaria(true)}
              >
                Aplicar Correção Monetária
              </Button>
            )}
          </div>
        )}

        {/* Calculos Salvos */}
        <CalculosSalvos 
          resultados={resultados}
          totalGeral={totalGeral}
          dadosContrato={dadosContrato}
          onLoadCalculo={handleLoadCalculo}
        />
      </div>
    </div>
  );
};

export default MobileLayout;
