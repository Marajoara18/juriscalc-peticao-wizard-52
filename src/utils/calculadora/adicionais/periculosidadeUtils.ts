
/**
 * Utilities for calculating dangerousness additional
 */

/**
 * Calculates dangerousness additional
 */
export const calcularPericulosidade = (
  salarioBase: number,
  percentualPericulosidade: number,
  baseCalculoPericulosidade: string
): number => {
  const baseCalculo = baseCalculoPericulosidade === 'salario_base' ? salarioBase : 0;
  
  return baseCalculo * (percentualPericulosidade / 100);
};
