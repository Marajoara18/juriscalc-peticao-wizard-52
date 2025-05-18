
/**
 * Utilities for calculating basic additional values like insalubrity and dangerousness
 */
import { SALARIO_MINIMO } from '@/utils/calculadoraConstants';

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
