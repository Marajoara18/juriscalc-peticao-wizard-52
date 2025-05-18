
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DadosContratoForm from '@/components/calculadora/DadosContratoForm';
import AdicionaisForm from '@/components/calculadora/AdicionaisForm';
import ResultadosCalculos from '@/components/calculadora/ResultadosCalculos';
import CorrecaoMonetaria from '@/components/calculadora/CorrecaoMonetaria';
import HonorariosAdvocaticios from '@/components/calculadora/HonorariosAdvocaticios';
import CalculosSalvos from '@/components/calculadora/CalculosSalvos';
import { DadosContrato, Adicionais } from '@/types/calculadora';

interface MobileLayoutProps {
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

const MobileLayout: React.FC<MobileLayoutProps> = ({
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
  const [showHonorariosAdvocaticios, setShowHonorariosAdvocaticios] = useState(false);
  
  // Handler para aplicar honorários advocatícios
  const aplicarHonorariosAdvocaticios = (valorHonorarios: number) => {
    // Atualiza o estado para incluir honorários
    handleAdicionaisChange("calcularHonorariosAdvocaticios", true);
    // Define o valor exato dos honorários calculados
    handleAdicionaisChange("valorHonorariosAdvocaticios", valorHonorarios.toString());
    // Define se os honorários devem ser incluídos no total geral
    handleAdicionaisChange("incluirTotalGeralHonorarios", true);
    // Recalcular os resultados para atualizar o valor dos honorários
    handleCalcularClick();
  };

  return (
    <div className="space-y-6">
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
            
            {/* Opção de honorários advocatícios - Agora após correção monetária */}
            {showHonorariosAdvocaticios ? (
              <>
                <HonorariosAdvocaticios 
                  totalGeral={totalGeral}
                  onAplicarHonorarios={aplicarHonorariosAdvocaticios} 
                />
                <Button 
                  variant="outline"
                  className="w-full border-juriscalc-navy text-juriscalc-navy mt-2"
                  onClick={() => setShowHonorariosAdvocaticios(false)}
                >
                  Ocultar Honorários Advocatícios
                </Button>
              </>
            ) : (
              <Button 
                variant="outline"
                className="w-full border-juriscalc-navy text-juriscalc-navy"
                onClick={() => setShowHonorariosAdvocaticios(true)}
              >
                Aplicar Honorários Advocatícios
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
