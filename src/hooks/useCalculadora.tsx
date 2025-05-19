import { useState } from 'react';
import { DadosContrato, Adicionais, Resultados } from '@/types/calculadora';
import { resultadosIniciais } from '@/utils/calculadoraConstants';
import { useDadosContrato } from './calculadora/useDadosContrato';
import { useAdicionais } from './calculadora/useAdicionais';
import { useCalculos } from './calculadora/useCalculos';
import { useCorrecaoMonetaria } from './calculadora/useCorrecaoMonetaria';
import useCalculadoraState from './calculadora/useCalculadoraState';
import { useCalculationLimits } from './calculadora/useCalculationLimits';

const useCalculadora = () => {
  // Estado para os inputs
  const [dadosContrato, setDadosContrato] = useState<DadosContrato>({
    dataAdmissao: '',
    dataDemissao: '',
    salarioBase: '',
    tipoRescisao: 'sem_justa_causa',
    diasTrabalhados: '',
    mesesTrabalhados: '',
    aviso_previo_cumprido: false,
  });

  // Estado para calcular adicionais
  const [adicionais, setAdicionais] = useState<Adicionais>({
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
    tipoTrabalhador: 'padrao',
    salarioUltimos3Meses: 'sim',
    ultimoSalario: '',
    salarioMes1: '',
    salarioMes2: '',
    mesesTrabalhadosUltimoEmprego: '',
    tempoContribuicaoINSS: '',
    calcularSalarioFamilia: false,
    quantidadeFilhos: '',
    calcularHonorariosAdvocaticios: false,
    percentualHonorariosAdvocaticios: '20',
    valorHonorariosAdvocaticios: '',
    incluirTotalGeralHonorarios: false,
  });

  // Estado para os resultados
  const [resultados, setResultados] = useState<Resultados>(resultadosIniciais);
  
  // Estado para controlar a exibição da correção monetária
  const [showCorrecaoMonetaria, setShowCorrecaoMonetaria] = useState<boolean>(false);

  // Hooks específicos
  const { handleDadosContratoChange, handleCheckboxChange, handleTipoRescisaoChange } = useDadosContrato(dadosContrato, setDadosContrato);
  const { handleAdicionaisChange } = useAdicionais(adicionais, setAdicionais);
  const { calcularResultados: originalCalcular } = useCalculos(dadosContrato, adicionais, setResultados);
  const { aplicarCorrecaoMonetaria } = useCorrecaoMonetaria(resultados, setResultados);
  const { totalAdicionais, totalGeral, hasCalculos } = useCalculadoraState.calcularTotais(resultados);
  const { podeCalcular, showSubscriptionModal, setShowSubscriptionModal, verificarLimiteCalculos } = useCalculationLimits();
  
  // Função para carregar um cálculo salvo
  const handleLoadCalculo = (calculo: any) => {
    useCalculadoraState.carregarCalculo(calculo, setDadosContrato, setAdicionais, setResultados, adicionais, resultados);
  };
  
  // Função modificada para verificar limites antes de calcular
  const calcularResultados = () => {
    return verificarLimiteCalculos(originalCalcular);
  };

  return {
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
    setShowSubscriptionModal,
    showCorrecaoMonetaria,
    setShowCorrecaoMonetaria,
    totalAdicionais,
    totalGeral,
    hasCalculos,
    handleLoadCalculo
  };
};

export default useCalculadora;
