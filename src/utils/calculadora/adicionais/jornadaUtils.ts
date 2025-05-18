
/**
 * Utilities for calculating work schedule related additionals
 */

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
