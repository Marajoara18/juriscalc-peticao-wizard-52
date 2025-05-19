
/**
 * Utilities for calculating discounts and salary differences
 */

/**
 * Calculate undue discounts
 */
export const calcularDescontosIndevidos = (
  calcular: boolean,
  valorDescontosIndevidos: number
): number => {
  if (!calcular) return 0;
  
  return valorDescontosIndevidos;
};

/**
 * Calculate salary differences
 */
export const calcularDiferencasSalariais = (
  calcular: boolean,
  valorDiferencasSalariais: number
): number => {
  if (!calcular) return 0;
  
  return valorDiferencasSalariais;
};

/**
 * Calculate custom calculation
 */
export const calcularCustom = (calcular: boolean, valorCustom: number): number => {
  return calcular ? valorCustom : 0;
};
