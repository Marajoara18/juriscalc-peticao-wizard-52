import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { DadosContrato, Adicionais, Resultados, CustomCalculo } from '@/types/calculadora';
import { resultadosIniciais } from '@/utils/calculadoraConstants';
import { useDadosContrato } from './calculadora/useDadosContrato';
import { useAdicionais } from './calculadora/useAdicionais';
import { useCalculos } from './calculadora/useCalculos';
import { useCorrecaoMonetaria } from './calculadora/useCorrecaoMonetaria';

const LIMITE_CALCULOS_GRATUITOS = 3;
const KEY_CONTADOR_CALCULOS = 'calculosRealizados';

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
    ultimoSalario: '',
    mesesTrabalhadosUltimoEmprego: '',
    tempoContribuicaoINSS: '',
    calcularSalarioFamilia: false,
    quantidadeFilhos: '',
  });

  // Estado para os resultados
  const [resultados, setResultados] = useState<Resultados>(resultadosIniciais);
  
  // Estado para controlar se o usuário pode realizar mais cálculos
  const [podeCalcular, setPodeCalcular] = useState<boolean>(true);
  
  // Estado para controlar a modal de assinatura
  const [showSubscriptionModal, setShowSubscriptionModal] = useState<boolean>(false);

  // Verificar número de cálculos realizados pelo usuário
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    const isAdmin = localStorage.getItem('userIsAdmin') === 'true';
    
    // Se o usuário for admin ou for o e-mail específico do admin mestre, pode calcular ilimitadamente
    if (isAdmin || userEmail === 'johnnysantos_177@msn.com' || userEmail === 'admin@juriscalc.com') {
      setPodeCalcular(true);
      return;
    }
    
    // Verificar o contador de cálculos do usuário atual
    const calculosKey = `${KEY_CONTADOR_CALCULOS}_${userId}`;
    const calculosRealizados = localStorage.getItem(calculosKey) 
      ? parseInt(localStorage.getItem(calculosKey) || '0', 10) 
      : 0;
    
    // Se já atingiu o limite, bloquear novos cálculos
    if (calculosRealizados >= LIMITE_CALCULOS_GRATUITOS) {
      setPodeCalcular(false);
    }
  }, []);

  // Hooks específicos
  const { handleDadosContratoChange, handleCheckboxChange, handleTipoRescisaoChange } = useDadosContrato(dadosContrato, setDadosContrato);
  const { handleAdicionaisChange } = useAdicionais(adicionais, setAdicionais);
  
  // Wrap the original calcularResultados to check for calculation limits
  const { calcularResultados: originalCalcular } = useCalculos(dadosContrato, adicionais, setResultados);
  const { aplicarCorrecaoMonetaria } = useCorrecaoMonetaria(resultados, setResultados);
  
  // Função modificada para verificar limites antes de calcular
  const calcularResultados = () => {
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    const isAdmin = localStorage.getItem('userIsAdmin') === 'true';
    
    // Se o usuário for admin ou for o e-mail específico do admin mestre, pode calcular ilimitadamente
    if (isAdmin || userEmail === 'johnnysantos_177@msn.com' || userEmail === 'admin@juriscalc.com') {
      return originalCalcular();
    }
    
    // Verificar se o usuário pode calcular
    if (!podeCalcular) {
      setShowSubscriptionModal(true);
      toast.error('Você atingiu o limite de cálculos gratuitos. Assine o plano premium para continuar calculando.');
      return;
    }
    
    // Incrementar contador de cálculos
    const calculosKey = `${KEY_CONTADOR_CALCULOS}_${userId}`;
    const calculosRealizados = localStorage.getItem(calculosKey) 
      ? parseInt(localStorage.getItem(calculosKey) || '0', 10) 
      : 0;
    
    const novoValor = calculosRealizados + 1;
    localStorage.setItem(calculosKey, novoValor.toString());
    
    // Verificar se atingiu o limite após este cálculo
    if (novoValor >= LIMITE_CALCULOS_GRATUITOS) {
      setPodeCalcular(false);
      toast.warning(`Este é seu último cálculo gratuito. Para continuar calculando, assine o plano premium.`);
    } else if (novoValor === LIMITE_CALCULOS_GRATUITOS - 1) {
      toast.warning(`Você tem apenas mais 1 cálculo gratuito disponível.`);
    }
    
    // Executar o cálculo original
    return originalCalcular();
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
    setShowSubscriptionModal
  };
};

export default useCalculadora;
