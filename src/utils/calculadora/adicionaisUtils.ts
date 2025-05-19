// Import necessary constants and functions
import { SALARIO_MINIMO } from '@/utils/calculadoraConstants';
import { calcularInsalubridade as calcularInsalubridadeUtils } from './adicionais/insalubridadeUtils';
import { calcularPericulosidade as calcularPericulosidadeUtils } from './adicionais/periculosidadeUtils';
import { calcularHonorariosAdvocaticios as calcularHonorariosAdvocaticiosUtils } from './adicionais/honorariosAdvocaticiosUtils';
import { formatarValorParaCalculo } from '@/utils/formatters';

// Import the necessary functions from beneficiosSociaisUtils.ts
import { calcularSeguroDesemprego, calcularSalarioFamilia } from './adicionais/beneficiosSociaisUtils';

/**
 * Calculate insalubrity
 */
export const calcularInsalubridade = (salarioBase: number, grauInsalubridade: string, baseCalculoInsalubridade: string): number => {
  return calcularInsalubridadeUtils(salarioBase, grauInsalubridade, baseCalculoInsalubridade);
};

/**
 * Calculate perillosity
 */
export const calcularPericulosidade = (salarioBase: number, percentualPericulosidade: number, baseCalculoPericulosidade: string): number => {
  return calcularPericulosidadeUtils(salarioBase, percentualPericulosidade, baseCalculoPericulosidade);
};

/**
 * Calculate late payment fine (Multa 467)
 */
export const calcularMulta467 = (calcularMulta: boolean, salarioBase: number): number => {
  return calcularMulta ? salarioBase : 0;
};

/**
 * Calculate fine for not annotating the employment record (Multa 477)
 */
export const calcularMulta477 = (calcularMulta: boolean, salarioBase: number): number => {
  return calcularMulta ? salarioBase : 0;
};

/**
 * Calculate night shift allowance
 */
export const calcularAdicionalNoturno = (
  calcularAdicional: boolean,
  salarioBase: number,
  percentualAdicionalNoturno: number,
  horasNoturnas: number
): number => {
  if (!calcularAdicional) return 0;
  
  const valorHoraNormal = salarioBase / 220; // Considerando 220 horas mensais
  const valorHoraNoturna = valorHoraNormal * (1 + (percentualAdicionalNoturno / 100));
  
  return valorHoraNoturna * horasNoturnas;
};

/**
 * Calculate overtime
 */
export const calcularHorasExtras = (
  calcularHorasExtras: boolean,
  salarioBase: number,
  quantidadeHorasExtras: number,
  percentualHorasExtras: number
): number => {
  if (!calcularHorasExtras) return 0;
  
  const valorHoraNormal = salarioBase / 220;
  const valorHoraExtra = valorHoraNormal * (1 + (percentualHorasExtras / 100));
  
  return valorHoraExtra * quantidadeHorasExtras;
};

/**
 * Calculate vacation pay
 */
export const calcularFeriasVencidas = (
  calcularFeriasVencidas: boolean,
  salarioBase: number,
  periodosFeriasVencidas: number
): number => {
  if (!calcularFeriasVencidas) return 0;
  
  return salarioBase * periodosFeriasVencidas;
};

/**
 * Calculate dismissal compensation
 */
export const calcularIndenizacaoDemissao = (
  calcularIndenizacaoDemissao: boolean,
  valorIndenizacaoDemissao: number
): number => {
  return calcularIndenizacaoDemissao ? valorIndenizacaoDemissao : 0;
};

/**
 * Calculate transportation voucher
 */
export const calcularValeTransporte = (
  calcularValeTransporte: boolean,
  valorDiarioVT: number,
  diasValeTransporte: number
): number => {
  if (!calcularValeTransporte) return 0;
  
  return valorDiarioVT * diasValeTransporte;
};

/**
 * Calculate food voucher
 */
export const calcularValeAlimentacao = (
  calcularValeAlimentacao: boolean,
  valorDiarioVA: number,
  diasValeAlimentacao: number
): number => {
  if (!calcularValeAlimentacao) return 0;
  
  return valorDiarioVA * diasValeAlimentacao;
};

/**
 * Calculate transfer allowance
 */
export const calcularAdicionalTransferencia = (
  calcularAdicionalTransferencia: boolean,
  salarioBase: number,
  percentualAdicionalTransferencia: number
): number => {
  if (!calcularAdicionalTransferencia) return 0;
  
  return salarioBase * (percentualAdicionalTransferencia / 100);
};

/**
 * Calculate undue discounts
 */
export const calcularDescontosIndevidos = (
  calcularDescontosIndevidos: boolean,
  valorDescontosIndevidos: number
): number => {
  if (!calcularDescontosIndevidos) return 0;
  
  return valorDescontosIndevidos;
};

/**
 * Calculate salary differences
 */
export const calcularDiferencasSalariais = (
  calcularDiferencasSalariais: boolean,
  valorDiferencasSalariais: number
): number => {
  if (!calcularDiferencasSalariais) return 0;
  
  return valorDiferencasSalariais;
};

/**
 * Calculate custom calculation
 */
export const calcularCustom = (calcularCustom: boolean, valorCustom: number): number => {
  return calcularCustom ? valorCustom : 0;
};

/**
 * Calculate unemployment insurance
 */
export function calcularSeguroDesempregoHelper(adicionais: any, salarioBase: number, tipoRescisao: string) {
  if (!adicionais.calcularSeguroDesemprego) return 0;
  
  // Parse the values properly
  const ultimoSalario = parseFloat(adicionais.ultimoSalario) || salarioBase;
  const salarioMes1 = parseFloat(adicionais.salarioMes1) || 0;
  const salarioMes2 = parseFloat(adicionais.salarioMes2) || 0;
  const mesesTrabalhados = parseInt(adicionais.mesesTrabalhadosUltimoEmprego) || 0;
  const tipoTrabalhador = adicionais.tipoTrabalhador || 'padrao';
  const salarioUltimos3Meses = adicionais.salarioUltimos3Meses || 'sim';
  
  // Calculate using the updated function
  const { valorTotal } = calcularSeguroDesemprego(
    true, 
    tipoRescisao, 
    tipoTrabalhador,
    salarioUltimos3Meses,
    ultimoSalario,
    salarioMes1,
    salarioMes2, 
    mesesTrabalhados
  );
  
  return valorTotal;
}

/**
 * Calculate family salary
 */
export const calcularSalarioFamiliaHelper = (
  calcularSalarioFamilia: boolean,
  salarioBase: number,
  quantidadeFilhos: number
): number => {
  return calcularSalarioFamilia(calcularSalarioFamilia, salarioBase, quantidadeFilhos);
};

/**
 * Calculate attorney's fees
 */
export const calcularHonorariosAdvocaticios = (
  calcularHonorariosAdvocaticios: boolean,
  totalGeral: number,
  percentualHonorariosAdvocaticios: number,
  valorHonorariosAdvocaticios: number,
  incluirTotalGeralHonorarios: boolean
): number => {
  return calcularHonorariosAdvocaticiosUtils(
    calcularHonorariosAdvocaticios,
    totalGeral,
    percentualHonorariosAdvocaticios,
    valorHonorariosAdvocaticios,
    incluirTotalGeralHonorarios
  );
};

/**
 * Main function to calculate all additionals
 */
export function calcularAdicionais(
  salarioBase: number, 
  adicionais: any,
  saldoSalario: number = 0,
  avisoPrevia: number = 0,
  decimoTerceiro: number = 0,
  ferias: number = 0,
  tercoConstitucional: number = 0
) {
  let adicionalInsalubridade = 0;
  let adicionalPericulosidade = 0;
  let multa467 = 0;
  let multa477 = 0;
  let adicionalNoturno = 0;
  let horasExtras = 0;
  let feriasVencidas = 0;
  let indenizacaoDemissao = 0;
  let valeTransporte = 0;
  let valeAlimentacao = 0;
  let adicionalTransferencia = 0;
  let descontosIndevidos = 0;
  let diferencasSalariais = 0;
  let customCalculo = 0;
  let seguroDesemprego = 0;
  let salarioFamilia = 0;
  let honorariosAdvocaticios = 0;
  
  // Calculate insalubrity
  if (adicionais.calcularInsalubridade) {
    adicionalInsalubridade = calcularInsalubridade(
      salarioBase, 
      adicionais.grauInsalubridade, 
      adicionais.baseCalculoInsalubridade
    );
  }
  
  // Calculate perillosity
  if (adicionais.calcularPericulosidade) {
    adicionalPericulosidade = calcularPericulosidade(
      salarioBase, 
      parseFloat(adicionais.percentualPericulosidade), 
      adicionais.baseCalculoPericulosidade
    );
  }
  
  // Calculate late payment fine (Multa 467)
  if (adicionais.calcularMulta467) {
    multa467 = calcularMulta467(adicionais.calcularMulta467, salarioBase);
  }
  
  // Calculate fine for not annotating the employment record (Multa 477)
  if (adicionais.calcularMulta477) {
    multa477 = calcularMulta477(adicionais.calcularMulta477, salarioBase);
  }
  
  // Calculate night shift allowance
  if (adicionais.calcularAdicionalNoturno) {
    const percentualAdicionalNoturno = parseFloat(adicionais.percentualAdicionalNoturno) || 0;
    const horasNoturnas = parseFloat(adicionais.horasNoturnas) || 0;
    adicionalNoturno = calcularAdicionalNoturno(
      adicionais.calcularAdicionalNoturno,
      salarioBase,
      percentualAdicionalNoturno,
      horasNoturnas
    );
  }
  
  // Calculate overtime
  if (adicionais.calcularHorasExtras) {
    const quantidadeHorasExtras = parseFloat(adicionais.quantidadeHorasExtras) || 0;
    const percentualHorasExtras = parseFloat(adicionais.percentualHorasExtras) || 0;
    horasExtras = calcularHorasExtras(
      adicionais.calcularHorasExtras,
      salarioBase,
      quantidadeHorasExtras,
      percentualHorasExtras
    );
  }
  
  // Calculate vacation pay
  if (adicionais.calcularFeriasVencidas) {
    const periodosFeriasVencidas = parseFloat(adicionais.periodosFeriasVencidas) || 0;
    feriasVencidas = calcularFeriasVencidas(
      adicionais.calcularFeriasVencidas,
      salarioBase,
      periodosFeriasVencidas
    );
  }
  
  // Calculate dismissal compensation
  if (adicionais.calcularIndenizacaoDemissao) {
    const valorIndenizacaoDemissao = parseFloat(adicionais.valorIndenizacaoDemissao) || 0;
    indenizacaoDemissao = calcularIndenizacaoDemissao(
      adicionais.calcularIndenizacaoDemissao,
      valorIndenizacaoDemissao
    );
  }
  
  // Calculate transportation voucher
  if (adicionais.calcularValeTransporte) {
    const valorDiarioVT = parseFloat(adicionais.valorDiarioVT) || 0;
    const diasValeTransporte = parseFloat(adicionais.diasValeTransporte) || 0;
    valeTransporte = calcularValeTransporte(
      adicionais.calcularValeTransporte,
      valorDiarioVT,
      diasValeTransporte
    );
  }
  
  // Calculate food voucher
  if (adicionais.calcularValeAlimentacao) {
    const valorDiarioVA = parseFloat(adicionais.valorDiarioVA) || 0;
    const diasValeAlimentacao = parseFloat(adicionais.diasValeAlimentacao) || 0;
    valeAlimentacao = calcularValeAlimentacao(
      adicionais.calcularValeAlimentacao,
      valorDiarioVA,
      diasValeAlimentacao
    );
  }
  
  // Calculate transfer allowance
  if (adicionais.calcularAdicionalTransferencia) {
    const percentualAdicionalTransferencia = parseFloat(adicionais.percentualAdicionalTransferencia) || 0;
    adicionalTransferencia = calcularAdicionalTransferencia(
      adicionais.calcularAdicionalTransferencia,
      salarioBase,
      percentualAdicionalTransferencia
    );
  }
  
  // Calculate undue discounts
  if (adicionais.calcularDescontosIndevidos) {
    const valorDescontosIndevidos = parseFloat(adicionais.valorDescontosIndevidos) || 0;
    descontosIndevidos = calcularDescontosIndevidos(
      adicionais.calcularDescontosIndevidos,
      valorDescontosIndevidos
    );
  }
  
  // Calculate salary differences
  if (adicionais.calcularDiferencasSalariais) {
    const valorDiferencasSalariais = parseFloat(adicionais.valorDiferencasSalariais) || 0;
    diferencasSalariais = calcularDiferencasSalariais(
      adicionais.calcularDiferencasSalariais,
      valorDiferencasSalariais
    );
  }
  
  // Calculate custom calculation
  if (adicionais.calcularCustom) {
    const valorCustom = parseFloat(adicionais.valorCustom) || 0;
    customCalculo = calcularCustom(adicionais.calcularCustom, valorCustom);
  }
  
  // Calculate unemployment insurance
  if (adicionais.calcularSeguroDesemprego) {
    seguroDesemprego = calcularSeguroDesempregoHelper(adicionais, salarioBase, 'sem_justa_causa');
  }
  
  // Calculate family salary
  if (adicionais.calcularSalarioFamilia) {
    const quantidadeFilhos = parseFloat(adicionais.quantidadeFilhos) || 0;
    salarioFamilia = calcularSalarioFamiliaHelper(
      adicionais.calcularSalarioFamilia,
      salarioBase,
      quantidadeFilhos
    );
  }
  
  // Calculate attorney's fees
  if (adicionais.calcularHonorariosAdvocaticios) {
    const percentualHonorariosAdvocaticios = parseFloat(adicionais.percentualHonorariosAdvocaticios) || 0;
    const valorHonorariosAdvocaticios = parseFloat(adicionais.valorHonorariosAdvocaticios) || 0;
    honorariosAdvocaticios = calcularHonorariosAdvocaticios(
      adicionais.calcularHonorariosAdvocaticios,
      saldoSalario + avisoPrevia + decimoTerceiro + ferias + tercoConstitucional + adicionalInsalubridade + adicionalPericulosidade + multa467 + multa477 + adicionalNoturno + horasExtras + feriasVencidas + indenizacaoDemissao + valeTransporte + valeAlimentacao + adicionalTransferencia + descontosIndevidos + diferencasSalariais + customCalculo + seguroDesemprego + salarioFamilia,
      percentualHonorariosAdvocaticios,
      valorHonorariosAdvocaticios,
      adicionais.incluirTotalGeralHonorarios
    );
  }
  
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
    honorariosAdvocaticios,
  };
}
