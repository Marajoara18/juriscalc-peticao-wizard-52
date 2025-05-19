
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import MobileLayout from './layout/MobileLayout';
import DesktopLayout from './layout/DesktopLayout';
import useCalculadora from '@/hooks/useCalculadora';
import useMobile from '@/hooks/use-mobile';
import { toast } from "sonner";

interface CalculadoraContainerProps {
  scrollToCalculosSalvos: () => void;
  onShowCorrecaoMonetaria?: () => void;
}

const CalculadoraContainer: React.FC<CalculadoraContainerProps> = ({ 
  scrollToCalculosSalvos,
  onShowCorrecaoMonetaria 
}) => {
  const isMobile = useMobile();
  
  const {
    dadosContrato, 
    adicionais, 
    resultados,
    showCorrecaoMonetaria,
    setShowCorrecaoMonetaria,
    handleDadosContratoChange,
    handleCheckboxChange,
    handleTipoRescisaoChange,
    handleAdicionaisChange,
    calcularResultados,
    totalGeral,
    hasCalculos,
    handleLoadCalculo,
    aplicarCorrecaoMonetaria
  } = useCalculadora();

  // Função para calcular as verbas rescisórias
  const handleCalcularClick = () => {
    // Verificar se os campos obrigatórios foram preenchidos
    if (!dadosContrato.dataAdmissao || !dadosContrato.dataDemissao || !dadosContrato.salarioBase) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    calcularResultados();
    
    // Rolar até a seção de resultados/cálculos salvos
    setTimeout(() => {
      scrollToCalculosSalvos();
    }, 500);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center">
          Calculadora de Verbas Rescisórias
        </h1>
      </div>

      {isMobile ? (
        <MobileLayout
          dadosContrato={dadosContrato}
          adicionais={adicionais}
          resultados={resultados}
          showCorrecaoMonetaria={showCorrecaoMonetaria}
          hasCalculos={hasCalculos}
          totalGeral={totalGeral}
          handleDadosContratoChange={handleDadosContratoChange}
          handleCheckboxChange={handleCheckboxChange}
          handleTipoRescisaoChange={handleTipoRescisaoChange}
          handleAdicionaisChange={handleAdicionaisChange}
          handleCalcularClick={handleCalcularClick}
          handleLoadCalculo={handleLoadCalculo}
          setShowCorrecaoMonetaria={setShowCorrecaoMonetaria}
          aplicarCorrecaoMonetaria={aplicarCorrecaoMonetaria}
          onShowCorrecaoMonetaria={onShowCorrecaoMonetaria}
        />
      ) : (
        <DesktopLayout
          dadosContrato={dadosContrato}
          adicionais={adicionais}
          resultados={resultados}
          showCorrecaoMonetaria={showCorrecaoMonetaria}
          hasCalculos={hasCalculos}
          totalGeral={totalGeral}
          handleDadosContratoChange={handleDadosContratoChange}
          handleCheckboxChange={handleCheckboxChange}
          handleTipoRescisaoChange={handleTipoRescisaoChange}
          handleAdicionaisChange={handleAdicionaisChange}
          handleCalcularClick={handleCalcularClick}
          handleLoadCalculo={handleLoadCalculo}
          setShowCorrecaoMonetaria={setShowCorrecaoMonetaria}
          aplicarCorrecaoMonetaria={aplicarCorrecaoMonetaria}
          onShowCorrecaoMonetaria={onShowCorrecaoMonetaria}
        />
      )}
    </div>
  );
};

export default CalculadoraContainer;
