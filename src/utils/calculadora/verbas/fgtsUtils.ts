
/**
 * Utilities for calculating FGTS values
 */
import { DadosContrato } from "@/types/calculadora";

/**
 * Calculates the FGTS value
 * @param salarioBase Base salary
 * @param mesesTrabalhados Months worked
 * @returns FGTS value
 */
export const calcularFGTS = (salarioBase: number, mesesTrabalhados: number): number => {
  return salarioBase * 0.08 * mesesTrabalhados;
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
