
import { Resultados, Adicionais } from '@/types/calculadora';

export const resultadosIniciais: Resultados = {
  verbasRescisorias: {
    saldoSalario: 0,
    avisoPrevia: 0,
    descontoAvisoPrevio: 0,
    feriasAvisoPrevia: 0,
    decimoTerceiroAvisoPrevia: 0,
    decimoTerceiro: 0,
    ferias: 0,
    tercoConstitucional: 0,
    fgts: 0,
    multaFgts: 0,
    indenizacaoQuebraContrato: 0,
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
    honorariosAdvocaticios: 0,
  }
};

export const adicionaisIniciais: Adicionais = {
  calcularInsalubridade: false,
  grauInsalubridade: 'minimo',
  baseCalculoInsalubridade: 'salario_minimo',
  insalubridadePeriodoEspecifico: false,
  dataInicioInsalubridade: '',
  dataFimInsalubridade: '',
  
  calcularPericulosidade: false,
  percentualPericulosidade: '30',
  baseCalculoPericulosidade: 'salario_base',
  periculosidadePeriodoEspecifico: false,
  dataInicioPericulosidade: '',
  dataFimPericulosidade: '',
  
  calcularMulta467: false,
  calcularMulta477: false,
  calcularAdicionalNoturno: false,
  percentualAdicionalNoturno: '20',
  horasNoturnas: '',
  calcularHorasExtras: false,
  quantidadeHorasExtras: '',
  percentualHorasExtras: '50',
  horasExtrasCalculos: [],
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
};

// Constantes para cálculos
export const SALARIO_MINIMO = 1412.00; // Valor para 2024/2025
export const VALOR_MAXIMO_SEGURO_DESEMPREGO = 2259.72;
export const FAIXA_1_SEGURO_DESEMPREGO = 1968.36;
export const FAIXA_2_SEGURO_DESEMPREGO = 3279.96;
export const VALOR_SALARIO_MINIMO_2025 = 1412.00;
export const VALOR_ADICIONAL_FAIXA_2 = 58.57;
export const VALOR_SALARIO_FAMILIA = 59.82;
export const LIMITE_SALARIO_FAMILIA = 1819.26;
