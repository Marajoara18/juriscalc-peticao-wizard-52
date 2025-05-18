
/**
 * Utilities for calculating work benefits
 */

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
