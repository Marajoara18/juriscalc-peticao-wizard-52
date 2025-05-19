
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import MobileLayout from './layout/MobileLayout';
import DesktopLayout from './layout/DesktopLayout';
import useCalculadora from '@/hooks/useCalculadora';
import { useIsMobile } from '@/hooks/use-mobile'; // Changed from default to named import
import { toast } from "sonner";

interface CalculadoraContainerProps {
  scrollToCalculosSalvos: () => void;
}

const CalculadoraContainer: React.FC<CalculadoraContainerProps> = ({ 
  scrollToCalculosSalvos
}) => {
  const isMobile = useIsMobile();
  
  const {
    dadosContrato, 
    adicionais, 
    resultados,
    handleDadosContratoChange,
    handleCheckboxChange,
    handleTipoRescisaoChange,
    handleAdicionaisChange,
    calcularResultados,
    totalGeral,
    hasCalculos,
    handleLoadCalculo
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
          showCorrecaoMonetaria={false}
          hasCalculos={hasCalculos}
          totalGeral={totalGeral}
          handleDadosContratoChange={handleDadosContratoChange}
          handleCheckboxChange={handleCheckboxChange}
          handleTipoRescisaoChange={handleTipoRescisaoChange}
          handleAdicionaisChange={handleAdicionaisChange}
          handleCalcularClick={handleCalcularClick}
          handleLoadCalculo={handleLoadCalculo}
          setShowCorrecaoMonetaria={() => {}}
          aplicarCorrecaoMonetaria={() => {}}
        />
      ) : (
        <DesktopLayout
          dadosContrato={dadosContrato}
          adicionais={adicionais}
          resultados={resultados}
          showCorrecaoMonetaria={false}
          hasCalculos={hasCalculos}
          totalGeral={totalGeral}
          handleDadosContratoChange={handleDadosContratoChange}
          handleCheckboxChange={handleCheckboxChange}
          handleTipoRescisaoChange={handleTipoRescisaoChange}
          handleAdicionaisChange={handleAdicionaisChange}
          handleCalcularClick={handleCalcularClick}
          handleLoadCalculo={handleLoadCalculo}
          setShowCorrecaoMonetaria={() => {}}
          aplicarCorrecaoMonetaria={() => {}}
        />
      )}
    </div>
  );
};

export default CalculadoraContainer;
