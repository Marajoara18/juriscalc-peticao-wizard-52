
/**
 * Utilities for calculating FGTS values
 */
import { DadosContrato } from "@/types/calculadora";
import { ajustarMesesPorDias } from "../verbasRescisoriasUtils";

/**
 * Calculates the FGTS value
 * @param salarioBase Base salary
 * @param mesesTrabalhados Months worked
 * @param diasNoUltimoMes Days worked in the last month (to apply the 15-day rule)
 * @returns FGTS value
 */
export const calcularFGTS = (salarioBase: number, mesesTrabalhados: number, diasNoUltimoMes: number = 0): number => {
  // Aplicar a regra dos 15 dias para considerar um mês completo
  const mesesAjustados = ajustarMesesPorDias(mesesTrabalhados, diasNoUltimoMes);
  return salarioBase * 0.08 * mesesAjustados;
};

/**
 * Calculates the FGTS fine
 * @param valorFGTS FGTS value
 * @param tipoRescisao Contract termination type
 * @returns FGTS fine value
 */
export const calcularMultaFGTS = (valorFGTS: number, tipoRescisao: string): number => {
  return (tipoRescisao === 'sem_justa_causa' || tipoRescisao === 'rescisao_indireta') 
    ? valorFGTS * 0.4
    : 0;
};
