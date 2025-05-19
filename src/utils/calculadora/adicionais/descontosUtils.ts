
/**
 * Utilities for calculating discounts and salary differences
 */

import { CustomCalculo } from '@/types/calculadora';

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
 * Calculate all custom calculations from array
 */
export const calcularTodosCustom = (
  calcular: boolean, 
  calculosCustom: CustomCalculo[]
): number => {
  if (!calcular || !calculosCustom || calculosCustom.length === 0) return 0;
  
  // Sum all custom calculation values
  return calculosCustom.reduce((total, calc) => {
    const valor = parseFloat(calc.valor) || 0;
    return total + valor;
  }, 0);
};

/**
 * Calculate single custom calculation (legacy support)
 */
export const calcularCustom = (calcular: boolean, valorCustom: number): number => {
  return calcular ? valorCustom : 0;
};
