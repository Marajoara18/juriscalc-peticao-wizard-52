
/**
 * Utilities for calculating attorney's fees
 */

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
  if (!calcularHonorariosAdvocaticios) return 0;
  
  // Check if there's a fixed value
  if (valorHonorariosAdvocaticios > 0) {
    return valorHonorariosAdvocaticios;
  }
  
  // Calculate based on percentage
  if (incluirTotalGeralHonorarios) {
    return totalGeral * (percentualHonorariosAdvocaticios / 100);
  }
  
  return 0;
};
