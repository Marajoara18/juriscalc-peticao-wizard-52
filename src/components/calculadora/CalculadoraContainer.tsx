import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import MobileLayout from './layout/MobileLayout';
import DesktopLayout from './layout/DesktopLayout';
import useCalculadora from '@/hooks/useCalculadora';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from "sonner";
import CalculadoraToolbar from './layout/CalculadoraToolbar';

interface CalculadoraContainerProps {
  scrollToCalculosSalvos: () => void;
}

const CalculadoraContainer: React.FC<CalculadoraContainerProps> = ({ 
  scrollToCalculosSalvos
}) => {
  const isMobile = useIsMobile();
  const [layoutMode, setLayoutMode] = useState<'desktop' | 'mobile'>(isMobile ? 'mobile' : 'desktop');
  const [showUserPanel, setShowUserPanel] = useState(false);
  
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

  // Toggle between desktop and mobile layout
  const toggleLayoutMode = () => {
    setLayoutMode(prev => prev === 'desktop' ? 'mobile' : 'desktop');
  };

  // Function for starting a new calculation
  const handleComecaCalcular = () => {
    // Placeholder for new calculation functionality
    window.location.reload();
  };

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
      <CalculadoraToolbar 
        showUserPanel={showUserPanel}
        layoutMode={layoutMode}
        toggleLayoutMode={toggleLayoutMode}
        handleComecaCalcular={handleComecaCalcular}
        setShowUserPanel={setShowUserPanel}
      />

      {layoutMode === 'mobile' ? (
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
