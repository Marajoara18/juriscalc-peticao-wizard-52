
/**
 * Utilities for calculating insalubrity
 */
import { SALARIO_MINIMO } from '@/utils/calculadoraConstants';

/**
 * Calculates insalubrity additional
 */
export const calcularInsalubridade = (
  salarioBase: number, 
  grauInsalubridade: string, 
  baseCalculoInsalubridade: string
): number => {
  const baseCalculo = baseCalculoInsalubridade === 'salario_minimo' ? SALARIO_MINIMO : salarioBase;
  let percentual = 0.1; // Mínimo (10%)
  
  if (grauInsalubridade === 'medio') {
    percentual = 0.2; // Médio (20%)
  } else if (grauInsalubridade === 'maximo') {
    percentual = 0.4; // Máximo (40%)
  }
  
  return baseCalculo * percentual;
};
