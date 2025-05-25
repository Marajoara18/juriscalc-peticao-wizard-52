
/**
 * Utilities for calculating vacation values
 */
import { DadosContrato } from "@/types/calculadora";

/**
 * Calculates the proportional vacation value based on time worked
 * Formula: (Salário Mensal / 12) × Meses Trabalhados
 * @param salarioBase Base salary
 * @param dataAdmissao Admission date
 * @param dataDemissao Termination date
 * @param tipoRescisao Contract termination type
 * @returns Vacation value
 */
export const calcularFerias = (salarioBase: number, dataAdmissao: string, dataDemissao: string, tipoRescisao: string): number => {
  // Não tem direito a férias proporcionais em caso de justa causa com menos de 12 meses trabalhados
  if (tipoRescisao === 'justa_causa') {
    return 0;
  }
  
  const dataAdmissaoObj = new Date(dataAdmissao);
  const dataDemissaoObj = new Date(dataDemissao);
  
  let mesesTrabalhados = 0;
  
  // Se admissão ocorreu no mesmo ano da demissão
  if (dataAdmissaoObj.getFullYear() === dataDemissaoObj.getFullYear()) {
    // Calcular meses trabalhados dentro do ano
    const mesAdmissao = dataAdmissaoObj.getMonth() + 1; // 1-indexed
    const mesDemissao = dataDemissaoObj.getMonth() + 1; // 1-indexed
    mesesTrabalhados = mesDemissao - mesAdmissao + 1;
  } else {
    // Se foi contratado em ano anterior, considerar todos os meses do ano da demissão
    mesesTrabalhados = dataDemissaoObj.getMonth() + 1;
  }
  
  // Garantir que não seja negativo ou zero
  if (mesesTrabalhados <= 0) {
    mesesTrabalhados = 1;
  }
  
  // Fórmula: (Salário Mensal / 12) × Meses Trabalhados
  return (salarioBase / 12) * mesesTrabalhados;
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
