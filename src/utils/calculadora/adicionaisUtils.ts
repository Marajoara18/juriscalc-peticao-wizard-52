/**
 * Utilities for calculating additional values
 */
import { Adicionais } from "@/types/calculadora";
import { 
  SALARIO_MINIMO, 
  VALOR_MAXIMO_SEGURO_DESEMPREGO, 
  FAIXA_1_SEGURO_DESEMPREGO, 
  FAIXA_2_SEGURO_DESEMPREGO,
  VALOR_SALARIO_FAMILIA,
  LIMITE_SALARIO_FAMILIA
} from '@/utils/calculadoraConstants';

/**
 * Calculates insalubrity additional
 */
export const calcularInsalubridade = (
  calcular: boolean, 
  grau: string, 
  baseCalculo: string, 
  salarioBase: number
): number => {
  if (!calcular) return 0;
  
  const baseValor = baseCalculo === 'salario_minimo' ? SALARIO_MINIMO : salarioBase;
  let percentual = 0.1; // Padrão: mínimo (10%)
  
  if (grau === 'medio') {
    percentual = 0.2; // Médio (20%)
  } else if (grau === 'maximo') {
    percentual = 0.4; // Máximo (40%)
  }
  
  return baseValor * percentual;
};

/**
 * Calculates dangerousness additional
 */
export const calcularPericulosidade = (
  calcular: boolean,
  baseCalculo: string,
  percentual: string,
  salarioBase: number
): number => {
  if (!calcular) return 0;
  
  const baseValor = baseCalculo === 'salario_base' ? salarioBase : SALARIO_MINIMO;
  const percentualValor = parseInt(percentual) / 100;
  
  return baseValor * percentualValor;
};

/**
 * Calculates Art. 467 CLT fine
 */
export const calcularMulta467 = (
  calcular: boolean,
  saldoSalario: number,
  avisoPrevia: number,
  decimoTerceiro: number,
  ferias: number,
  tercoConstitucional: number
): number => {
  if (!calcular) return 0;
  
  return (saldoSalario + avisoPrevia + decimoTerceiro + ferias + tercoConstitucional) * 0.5;
};

/**
 * Calculates Art. 477 CLT fine
 */
export const calcularMulta477 = (calcular: boolean, salarioBase: number): number => {
  if (!calcular) return 0;
  
  return salarioBase;
};

/**
 * Calculates night shift additional
 */
export const calcularAdicionalNoturno = (
  calcular: boolean,
  percentual: string,
  horas: string,
  salarioBase: number
): number => {
  if (!calcular) return 0;
  
  const valorHoraNormal = salarioBase / 220;
  const percentualValor = parseInt(percentual) / 100;
  const horasNoturnas = parseInt(horas) || 0;
  
  return valorHoraNormal * percentualValor * horasNoturnas;
};

/**
 * Calculates overtime
 */
export const calcularHorasExtras = (
  calcular: boolean,
  percentual: string,
  quantidade: string,
  salarioBase: number
): number => {
  if (!calcular) return 0;
  
  const valorHoraNormal = salarioBase / 220;
  const percentualValor = parseInt(percentual) / 100;
  const quantidadeHorasExtras = parseInt(quantidade) || 0;
  
  return valorHoraNormal * (1 + percentualValor) * quantidadeHorasExtras;
};

/**
 * Calculates expired vacation values
 */
export const calcularFeriasVencidas = (
  calcular: boolean,
  periodos: string,
  salarioBase: number
): number => {
  if (!calcular) return 0;
  
  const periodosFeriasVencidas = parseInt(periodos) || 1;
  return salarioBase * periodosFeriasVencidas + (salarioBase * periodosFeriasVencidas / 3);
};

/**
 * Calculates dismissal indemnification
 */
export const calcularIndenizacaoDemissao = (
  calcular: boolean,
  valor: string,
  salarioBase: number
): number => {
  if (!calcular) return 0;
  
  return parseFloat(valor) || salarioBase;
};

/**
 * Calculates transportation voucher
 */
export const calcularValeTransporte = (
  calcular: boolean,
  valorDiario: string,
  dias: string
): number => {
  if (!calcular) return 0;
  
  const valorDiarioVT = parseFloat(valorDiario) || 0;
  const diasVT = parseInt(dias) || 22;
  
  return valorDiarioVT * diasVT;
};

/**
 * Calculates meal voucher
 */
export const calcularValeAlimentacao = (
  calcular: boolean,
  valorDiario: string,
  dias: string
): number => {
  if (!calcular) return 0;
  
  const valorDiarioVA = parseFloat(valorDiario) || 0;
  const diasVA = parseInt(dias) || 22;
  
  return valorDiarioVA * diasVA;
};

/**
 * Calculates transfer additional
 */
export const calcularAdicionalTransferencia = (
  calcular: boolean,
  percentual: string,
  salarioBase: number
): number => {
  if (!calcular) return 0;
  
  const percentualTransferencia = parseInt(percentual) / 100;
  return salarioBase * percentualTransferencia;
};

/**
 * Calculates unemployment insurance
 */
export const calcularSeguroDesemprego = (
  calcular: boolean,
  tipoRescisao: string, 
  ultimoSalario: number, 
  mesesTrabalhadosUltimoEmprego: number, 
  tempoContribuicaoINSS: number
): number => {
  if (!calcular) return 0;
  
  // Verifica se é elegível com base no tipo de rescisão
  const elegivel = tipoRescisao === 'sem_justa_causa' || tipoRescisao === 'rescisao_indireta';
  
  if (!elegivel) return 0;
  
  let parcelas = 0;
  
  // Determinar número de parcelas com base no tempo de trabalho
  if (tempoContribuicaoINSS < 1) {
    if (mesesTrabalhadosUltimoEmprego >= 12 && mesesTrabalhadosUltimoEmprego < 24) {
      parcelas = 4;
    }
  } else if (tempoContribuicaoINSS >= 1 && tempoContribuicaoINSS < 2) {
    if (mesesTrabalhadosUltimoEmprego >= 9) {
      parcelas = 5;
    }
  } else if (tempoContribuicaoINSS >= 2) {
    if (mesesTrabalhadosUltimoEmprego >= 6) {
      parcelas = 5;
    }
  }
  
  // Cálculo do valor da parcela
  let valorParcela = 0;
  
  if (ultimoSalario <= FAIXA_1_SEGURO_DESEMPREGO) {
    valorParcela = ultimoSalario * 0.8;
  } else if (ultimoSalario <= FAIXA_2_SEGURO_DESEMPREGO) {
    valorParcela = (FAIXA_1_SEGURO_DESEMPREGO * 0.8) + ((ultimoSalario - FAIXA_1_SEGURO_DESEMPREGO) * 0.5);
  } else {
    valorParcela = VALOR_MAXIMO_SEGURO_DESEMPREGO; // Valor máximo da parcela em 2024
  }
  
  // Valor total do seguro-desemprego
  return valorParcela * parcelas;
};

/**
 * Calculates family salary benefit
 */
export const calcularSalarioFamilia = (
  calcular: boolean,
  salarioBase: number,
  quantidadeFilhos: number
): number => {
  if (!calcular || salarioBase > LIMITE_SALARIO_FAMILIA || quantidadeFilhos <= 0) {
    return 0;
  }
  
  // Cálculo do valor do salário-família
  return VALOR_SALARIO_FAMILIA * quantidadeFilhos;
};

/**
 * Calculates all additional values based on contract and additional data
 */
export const calcularAdicionais = (
  salarioBase: number,
  adicionais: Adicionais,
  saldoSalario: number,
  avisoPrevia: number,
  decimoTerceiro: number,
  ferias: number,
  tercoConstitucional: number
) => {
  // Cálculo de insalubridade e periculosidade
  let adicionalInsalubridade = calcularInsalubridade(
    adicionais.calcularInsalubridade,
    adicionais.grauInsalubridade,
    adicionais.baseCalculoInsalubridade,
    salarioBase
  );
  
  let adicionalPericulosidade = calcularPericulosidade(
    adicionais.calcularPericulosidade,
    adicionais.baseCalculoPericulosidade,
    adicionais.percentualPericulosidade,
    salarioBase
  );

  // Decisão entre insalubridade e periculosidade (não pode acumular)
  if (adicionais.calcularInsalubridade && adicionais.calcularPericulosidade) {
    if (adicionalPericulosidade > adicionalInsalubridade) {
      adicionalInsalubridade = 0;
    } else {
      adicionalPericulosidade = 0;
    }
  }

  // Cálculo das multas
  const multa467 = calcularMulta467(
    adicionais.calcularMulta467,
    saldoSalario,
    avisoPrevia,
    decimoTerceiro,
    ferias,
    tercoConstitucional
  );
  
  const multa477 = calcularMulta477(adicionais.calcularMulta477, salarioBase);

  // Cálculo de adicionais noturnos e horas extras
  const adicionalNoturno = calcularAdicionalNoturno(
    adicionais.calcularAdicionalNoturno,
    adicionais.percentualAdicionalNoturno,
    adicionais.horasNoturnas,
    salarioBase
  );
  
  const horasExtras = calcularHorasExtras(
    adicionais.calcularHorasExtras,
    adicionais.percentualHorasExtras,
    adicionais.quantidadeHorasExtras,
    salarioBase
  );

  // Cálculo de férias vencidas e indenização
  const feriasVencidas = calcularFeriasVencidas(
    adicionais.calcularFeriasVencidas,
    adicionais.periodosFeriasVencidas,
    salarioBase
  );
  
  const indenizacaoDemissao = calcularIndenizacaoDemissao(
    adicionais.calcularIndenizacaoDemissao,
    adicionais.valorIndenizacaoDemissao,
    salarioBase
  );

  // Cálculo dos vales
  const valeTransporte = calcularValeTransporte(
    adicionais.calcularValeTransporte,
    adicionais.valorDiarioVT,
    adicionais.diasValeTransporte
  );
  
  const valeAlimentacao = calcularValeAlimentacao(
    adicionais.calcularValeAlimentacao,
    adicionais.valorDiarioVA,
    adicionais.diasValeAlimentacao
  );

  // Outros cálculos
  const adicionalTransferencia = calcularAdicionalTransferencia(
    adicionais.calcularAdicionalTransferencia,
    adicionais.percentualAdicionalTransferencia,
    salarioBase
  );
  
  const descontosIndevidos = adicionais.calcularDescontosIndevidos ? 
    parseFloat(adicionais.valorDescontosIndevidos) || 0 : 0;
    
  const diferencasSalariais = adicionais.calcularDiferencasSalariais ? 
    parseFloat(adicionais.valorDiferencasSalariais) || 0 : 0;
    
  const customCalculo = adicionais.calcularCustom ? 
    parseFloat(adicionais.valorCustom) || 0 : 0;

  // Cálculo do seguro desemprego e salário família
  const seguroDesemprego = calcularSeguroDesemprego(
    adicionais.calcularSeguroDesemprego,
    adicionais.calcularSeguroDesemprego ? 'sem_justa_causa' : '',
    parseFloat(adicionais.ultimoSalario || '0') || 0,
    parseInt(adicionais.mesesTrabalhadosUltimoEmprego) || 0,
    parseFloat(adicionais.tempoContribuicaoINSS) || 0
  );
  
  const salarioFamilia = calcularSalarioFamilia(
    adicionais.calcularSalarioFamilia,
    salarioBase,
    parseInt(adicionais.quantidadeFilhos || '0')
  );

  return {
    adicionalInsalubridade,
    adicionalPericulosidade,
    multa467,
    multa477,
    adicionalNoturno,
    horasExtras,
    feriasVencidas,
    indenizacaoDemissao,
    valeTransporte,
    valeAlimentacao,
    adicionalTransferencia,
    descontosIndevidos,
    diferencasSalariais,
    customCalculo,
    seguroDesemprego,
    salarioFamilia,
  };
};
