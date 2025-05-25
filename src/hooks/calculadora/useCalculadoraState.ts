
import { DadosContrato, Adicionais, Resultados } from '@/types/calculadora';
import { resultadosIniciais } from '@/utils/calculadoraConstants';

const useCalculadoraState = {
  // Reiniciar o formulário para um novo cálculo
  reiniciarFormulario: (
    setDadosContrato: React.Dispatch<React.SetStateAction<DadosContrato>>,
    setAdicionais: React.Dispatch<React.SetStateAction<Adicionais>>,
    setResultados: React.Dispatch<React.SetStateAction<Resultados>>
  ) => {
    // Reiniciar dados do contrato
    setDadosContrato({
      dataAdmissao: '',
      dataDemissao: '',
      salarioBase: '',
      tipoRescisao: 'sem_justa_causa',
      diasTrabalhados: '',
      mesesTrabalhados: '',
      aviso_previo_cumprido: false,
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
      horasExtrasCalculos: [], // Added missing property
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
      calcularHonorariosAdvocaticios: false,
      percentualHonorariosAdvocaticios: '20',
      valorHonorariosAdvocaticios: '', // Adicionado campo faltante
      incluirTotalGeralHonorarios: false,
    });
    
    // Reiniciar resultados
    setResultados(resultadosIniciais);
  },
  
  // Carregar um cálculo salvo
  carregarCalculo: (
    calculo: any,
    setDadosContrato: React.Dispatch<React.SetStateAction<DadosContrato>>,
    setAdicionais: React.Dispatch<React.SetStateAction<Adicionais>>,
    setResultados: React.Dispatch<React.SetStateAction<Resultados>>,
    adicionais: Adicionais,
    resultados: Resultados
  ) => {
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
      calcularHonorariosAdvocaticios: calculo.adicionais?.honorariosAdvocaticios > 0,
      percentualHonorariosAdvocaticios: '20',
      valorHonorariosAdvocaticios: calculo.adicionais?.honorariosAdvocaticios?.toString() || '', // Valor atual dos honorários
      incluirTotalGeralHonorarios: false,
    });
  },
  
  // Calcular totais para exibição e verificações
  calcularTotais: (resultados: Resultados) => {
    // Calcular o total dos adicionais
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

    // Considerar o desconto do aviso prévio no cálculo do total geral
    let totalGeral = resultados.verbasRescisorias.total + totalAdicionais - 
                      (resultados.verbasRescisorias.descontoAvisoPrevio || 0);
    
    // Verificar se há cálculos para mostrar opção de salvar
    const hasCalculos = totalGeral > 0;
    
    return { totalAdicionais, totalGeral, hasCalculos };
  }
};

export default useCalculadoraState;
