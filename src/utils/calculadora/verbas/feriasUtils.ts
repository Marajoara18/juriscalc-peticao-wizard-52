
/**
 * Utilities for calculating vacation values
 */
import { DadosContrato } from "@/types/calculadora";

/**
 * Calculates the proportional vacation value - now returns the full monthly salary
 * Formula: Salário Mensal (without considering months worked)
 * @param salarioBase Base salary
 * @param dataAdmissao Admission date
 * @param dataDemissao Termination date
 * @param tipoRescisao Contract termination type
 * @returns Vacation value equal to monthly salary
 */
export const calcularFerias = (salarioBase: number, dataAdmissao: string, dataDemissao: string, tipoRescisao: string): number => {
  // Não tem direito a férias proporcionais em caso de justa causa
  if (tipoRescisao === 'justa_causa') {
    return 0;
  }
  
  // Nova regra: Férias proporcionais = Salário Mensal
  return salarioBase;
};

/**
 * Calculates expired vacation value - Moved to adicionaisUtils.ts
 * This function remains here for backward compatibility but doesn't calculate anymore
 * @param salarioBase Base salary
 * @param feriasVencidas Whether there are expired vacations
 * @returns Always returns 0 now
 */
export const calcularFeriasVencidas = (salarioBase: number, feriasVencidas: boolean): number => {
  // This functionality is now handled in the adicionais module
  return 0;
};

/**
 * Calculates the constitutional third of vacation
 * @param valorFerias Vacation value
 * @returns Constitutional third
 */
export const calcularTercoConstitucional = (valorFerias: number): number => {
  return valorFerias / 3;
};
