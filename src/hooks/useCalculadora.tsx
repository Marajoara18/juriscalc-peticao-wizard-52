
import { useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { DadosContrato, Adicionais, Resultados } from '@/types/calculadora';
import { resultadosIniciais } from '@/utils/calculadoraConstants';
import { useDadosContrato } from './calculadora/useDadosContrato';
import { useAdicionais } from './calculadora/useAdicionais';
import { useCalculos } from './calculadora/useCalculos';
import { useCorrecaoMonetaria } from './calculadora/useCorrecaoMonetaria';

const useCalculadora = () => {
  // Estado para os inputs
  const [dadosContrato, setDadosContrato] = useState<DadosContrato>({
    dataAdmissao: '',
    dataDemissao: '',
    salarioBase: '',
    tipoRescisao: 'sem_justa_causa',
    diasTrabalhados: '',
    mesesTrabalhados: '',
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
    descricaoCustom: '',
    valorCustom: '',
    calcularSeguroDesemprego: false,
    ultimoSalario: '',
    mesesTrabalhadosUltimoEmprego: '',
    tempoContribuicaoINSS: '',
  });

  // Estado para os resultados
  const [resultados, setResultados] = useState<Resultados>(resultadosIniciais);

  // Hooks específicos
  const { handleDadosContratoChange } = useDadosContrato(dadosContrato, setDadosContrato);
  const { handleAdicionaisChange } = useAdicionais(adicionais, setAdicionais);
  const { calcularResultados } = useCalculos(dadosContrato, adicionais, setResultados);
  const { aplicarCorrecaoMonetaria } = useCorrecaoMonetaria(resultados, setResultados);

  return {
    dadosContrato,
    adicionais,
    resultados,
    setDadosContrato,
    setAdicionais,
    setResultados,
    handleDadosContratoChange,
    handleAdicionaisChange,
    calcularResultados,
    aplicarCorrecaoMonetaria,
  };
};

export default useCalculadora;
