import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import UserManagement from '@/components/auth/UserManagement';
import useCalculadora from '@/hooks/useCalculadora';
import { toast } from 'sonner';
import DesktopLayout from '@/components/calculadora/layout/DesktopLayout';
import MobileLayout from '@/components/calculadora/layout/MobileLayout';
import CalculadoraToolbar from '@/components/calculadora/layout/CalculadoraToolbar';
import HelpSectionContainer from '@/components/calculadora/layout/HelpSectionContainer';

const Calculadora = () => {
  const navigate = useNavigate();
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
    aplicarCorrecaoMonetaria
  } = useCalculadora();
  
  const [showUserPanel, setShowUserPanel] = useState(false);
  const [showCorrecaoMonetaria, setShowCorrecaoMonetaria] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'desktop' | 'mobile'>('desktop');
  
  // Verificar se o usuário está logado
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/');
    }

    // Detectar tipo de dispositivo para layout inicial
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobileDevice) {
      setLayoutMode('mobile');
    }
  }, [navigate]);
  
  const handleComecaCalcular = () => {
    // Reiniciar dados do formulário
    setDadosContrato({
      dataAdmissao: '',
      dataDemissao: '',
      salarioBase: '',
      tipoRescisao: 'sem_justa_causa',
      diasTrabalhados: '',
      mesesTrabalhados: '',
      aviso_previo_cumprido: false,
      ferias_vencidas: false,
    });
    
    // Reiniciar campos de adicionais
    setAdicionais({
      calcularInsalubridade: false,
      grauInsalubridade: 'minimo',
      baseCalculoInsalubridade: 'salario_minimo',
      calcularPericulosidade: false,
      percentualPericulosidade: '30',
      baseCalculoPericulosidade: 'salario_base',
      calcularMulta467: false,
      calcularMulta477: false,
      calcularAdicionalNoturno: false,
      percentualAdicionalNoturno: '20',
      horasNoturnas: '',
      calcularHorasExtras: false,
      quantidadeHorasExtras: '',
      percentualHorasExtras: '50',
      calcularFeriasVencidas: false,
      periodosFeriasVencidas: '1',
      calcularIndenizacaoDemissao: false,
      valorIndenizacaoDemissao: '',
      calcularValeTransporte: false,
      valorDiarioVT: '',
      diasValeTransporte: '',
      calcularValeAlimentacao: false,
      valorDiarioVA: '',
      diasValeAlimentacao: '',
      calcularAdicionalTransferencia: false,
      percentualAdicionalTransferencia: '25',
      calcularDescontosIndevidos: false,
      valorDescontosIndevidos: '',
      calcularDiferencasSalariais: false,
      valorDiferencasSalariais: '',
      calcularCustom: false,
      calculosCustom: [],
      descricaoCustom: '',
      valorCustom: '',
      calcularSeguroDesemprego: false,
      ultimoSalario: '',
      mesesTrabalhadosUltimoEmprego: '',
      tempoContribuicaoINSS: '',
      calcularSalarioFamilia: false,
      quantidadeFilhos: '',
    });
    
    // Reiniciar resultados
    setResultados({
      verbasRescisorias: {
        saldoSalario: 0,
        avisoPrevia: 0,
        decimoTerceiro: 0,
        ferias: 0,
        tercoConstitucional: 0,
        fgts: 0,
        multaFgts: 0,
        total: 0,
      },
      adicionais: {
        adicionalInsalubridade: 0,
        adicionalPericulosidade: 0,
        multa467: 0,
        multa477: 0,
        adicionalNoturno: 0,
        horasExtras: 0,
        feriasVencidas: 0,
        indenizacaoDemissao: 0,
        valeTransporte: 0,
        valeAlimentacao: 0,
        adicionalTransferencia: 0,
        descontosIndevidos: 0,
        diferencasSalariais: 0,
        customCalculo: 0,
        seguroDesemprego: 0,
        salarioFamilia: 0,
      }
    });
    
    setShowCorrecaoMonetaria(false);
    toast.info('Formulário reiniciado. Você pode iniciar um novo cálculo.');
  };
  
  const handleLoadCalculo = (calculo: any) => {
    if (!calculo) return;
    
    // Carregar dados do contrato
    if (calculo.dadosContrato) {
      setDadosContrato({
        dataAdmissao: calculo.dadosContrato.dataAdmissao || '',
        dataDemissao: calculo.dadosContrato.dataDemissao || '',
        salarioBase: calculo.dadosContrato.salarioBase || '',
        tipoRescisao: calculo.dadosContrato.tipoRescisao || 'sem_justa_causa',
        diasTrabalhados: calculo.dadosContrato.diasTrabalhados || '',
        mesesTrabalhados: calculo.dadosContrato.mesesTrabalhados || '',
        aviso_previo_cumprido: calculo.dadosContrato.aviso_previo_cumprido || false,
        ferias_vencidas: calculo.dadosContrato.ferias_vencidas || false,
      });
    }
    
    // Carregar verbas rescisórias e adicionais
    if (calculo.verbasRescisorias || calculo.adicionais) {
      setResultados({
        verbasRescisorias: calculo.verbasRescisorias || resultados.verbasRescisorias,
        adicionais: calculo.adicionais || resultados.adicionais
      });
    }
    
    // Carregar configurações dos adicionais com base nos valores calculados
    setAdicionais({
      ...adicionais,
      calcularInsalubridade: calculo.adicionais?.adicionalInsalubridade > 0,
      calcularPericulosidade: calculo.adicionais?.adicionalPericulosidade > 0,
      calcularMulta467: calculo.adicionais?.multa467 > 0,
      calcularMulta477: calculo.adicionais?.multa477 > 0,
      calcularAdicionalNoturno: calculo.adicionais?.adicionalNoturno > 0,
      calcularHorasExtras: calculo.adicionais?.horasExtras > 0,
      calcularFeriasVencidas: calculo.adicionais?.feriasVencidas > 0,
      calcularIndenizacaoDemissao: calculo.adicionais?.indenizacaoDemissao > 0,
      calcularValeTransporte: calculo.adicionais?.valeTransporte > 0,
      calcularValeAlimentacao: calculo.adicionais?.valeAlimentacao > 0,
      calcularAdicionalTransferencia: calculo.adicionais?.adicionalTransferencia > 0,
      calcularDescontosIndevidos: calculo.adicionais?.descontosIndevidos > 0,
      calcularDiferencasSalariais: calculo.adicionais?.diferencasSalariais > 0,
      calcularCustom: calculo.adicionais?.customCalculo > 0,
      calculosCustom: calculo.calculosCustom || [],
      calcularSeguroDesemprego: calculo.adicionais?.seguroDesemprego > 0,
      calcularSalarioFamilia: calculo.adicionais?.salarioFamilia > 0,
    });
    
    toast.success('Cálculo carregado com sucesso!');
  };
  
  // Calcular o total geral para o botão de salvar cálculos
  const totalAdicionais = 
    resultados.adicionais.adicionalInsalubridade +
    resultados.adicionais.adicionalPericulosidade +
    resultados.adicionais.multa467 +
    resultados.adicionais.multa477 +
    resultados.adicionais.adicionalNoturno +
    resultados.adicionais.horasExtras +
    resultados.adicionais.feriasVencidas +
    resultados.adicionais.indenizacaoDemissao +
    resultados.adicionais.valeTransporte +
    resultados.adicionais.valeAlimentacao +
    resultados.adicionais.adicionalTransferencia +
    resultados.adicionais.descontosIndevidos +
    resultados.adicionais.diferencasSalariais +
    resultados.adicionais.customCalculo +
    resultados.adicionais.seguroDesemprego +
    resultados.adicionais.salarioFamilia;

  const totalGeral = resultados.verbasRescisorias.total + totalAdicionais;
  
  // Verificar se há cálculos para mostrar opção de salvar
  const hasCalculos = totalGeral > 0;

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
    <Layout>
      <div className="container mx-auto py-10 px-4">
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
      </div>
    </Layout>
  );
};

export default Calculadora;
