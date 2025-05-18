
import React, { useState, useEffect } from 'react';
import UserManagement from '@/components/auth/UserManagement';
import useCalculadora from '@/hooks/useCalculadora';
import { toast } from 'sonner';
import DesktopLayout from '@/components/calculadora/layout/DesktopLayout';
import MobileLayout from '@/components/calculadora/layout/MobileLayout';
import CalculadoraToolbar from '@/components/calculadora/layout/CalculadoraToolbar';
import HelpSectionContainer from '@/components/calculadora/layout/HelpSectionContainer';
import useCalculadoraState from '@/hooks/calculadora/useCalculadoraState';

const CalculadoraContainer = () => {
  const { 
    dadosContrato, 
    adicionais, 
    resultados,
    setDadosContrato,
    setAdicionais,
    setResultados,
    handleDadosContratoChange, 
    handleCheckboxChange,
    handleTipoRescisaoChange,
    handleAdicionaisChange, 
    calcularResultados,
    aplicarCorrecaoMonetaria,
    podeCalcular,
    showSubscriptionModal,
    setShowSubscriptionModal
  } = useCalculadora();
  
  const [showUserPanel, setShowUserPanel] = useState(false);
  const [showCorrecaoMonetaria, setShowCorrecaoMonetaria] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'desktop' | 'mobile'>('desktop');
  
  // Detectar tipo de dispositivo para layout inicial
  useEffect(() => {
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobileDevice) {
      setLayoutMode('mobile');
    }
  }, []);
  
  const handleComecaCalcular = () => {
    // Reiniciar dados do formulário
    useCalculadoraState.reiniciarFormulario(setDadosContrato, setAdicionais, setResultados);
    setShowCorrecaoMonetaria(false);
    toast.info('Formulário reiniciado. Você pode iniciar um novo cálculo.');
  };
  
  const handleLoadCalculo = (calculo: any) => {
    if (!calculo) return;
    useCalculadoraState.carregarCalculo(calculo, setDadosContrato, setAdicionais, setResultados, adicionais, resultados);
    toast.success('Cálculo carregado com sucesso!');
  };
  
  // Calcular o total geral para o botão de salvar cálculos
  const { totalGeral, hasCalculos } = useCalculadoraState.calcularTotais(resultados, adicionais);
  
  const handleCalcularClick = () => {
    calcularResultados();
    console.log("Cálculos realizados com sucesso. Total:", totalGeral);
  };

  // Toggle para alternar entre layout para desktop e mobile
  const toggleLayoutMode = () => {
    setLayoutMode(prevMode => prevMode === 'desktop' ? 'mobile' : 'desktop');
    toast.success(`Layout alterado para ${layoutMode === 'desktop' ? 'Smartphone' : 'Computador'}`);
  };

  return (
    <>
      <CalculadoraToolbar 
        showUserPanel={showUserPanel}
        layoutMode={layoutMode}
        toggleLayoutMode={toggleLayoutMode}
        handleComecaCalcular={handleComecaCalcular}
        setShowUserPanel={setShowUserPanel}
      />

      {showUserPanel ? (
        <UserManagement />
      ) : (
        <>
          {layoutMode === 'desktop' ? (
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
            />
          ) : (
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
            />
          )}
      
          <HelpSectionContainer calculosDisponiveis={hasCalculos} />
        </>
      )}
    </>
  );
};

export default CalculadoraContainer;
