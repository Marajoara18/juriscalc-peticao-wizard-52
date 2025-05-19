
/**
 * Utilities for calculating work benefits
 */
import { ajustarMesesPorDias } from "../verbasRescisoriasUtils";

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
  let diasVT = parseInt(dias) || 22; // Padrão é 22 dias úteis por mês
  
  // Se a quantidade de dias for parcial (mais que 15 dias), considera um mês completo (22 dias úteis)
  if (diasVT > 15 && diasVT < 22) {
    diasVT = 22;
  }
  
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
  let diasVA = parseInt(dias) || 22; // Padrão é 22 dias úteis por mês
  
  // Se a quantidade de dias for parcial (mais que 15 dias), considera um mês completo (22 dias úteis)
  if (diasVA > 15 && diasVA < 22) {
    diasVA = 22;
  }
  
  return valorDiarioVA * diasVA;
};
