
/**
 * Utilities for calculating vacation values
 */
import { DadosContrato } from "@/types/calculadora";

/**
 * Calculates the proportional vacation value based on time worked since the last vacation period
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
  
  // Consideramos a quantidade de meses como o mês da demissão (1-indexed)
  const meses = dataDemissaoObj.getMonth() + 1;
  
  // Se admissão ocorreu no mesmo ano, ajustar para não contar meses antes da contratação
  if (dataAdmissaoObj.getFullYear() === dataDemissaoObj.getFullYear()) {
    const mesesAdmissao = dataAdmissaoObj.getMonth() + 1;
    // Se meses da demissão for maior, subtrair meses antes da admissão e adicionar 1 para incluir o mês de admissão
    if (meses > mesesAdmissao) {
      const mesesTrabalhados = meses - mesesAdmissao + 1;
      // Cada mês trabalhado dá direito a 1/12 de 30 dias de férias
      const diasDeFerias = (mesesTrabalhados * 30) / 12;
      // Valor das férias proporcionais = dias de férias * (salário / 30)
      return diasDeFerias * (salarioBase / 30);
    }
    // Se for igual ou menor, considerar apenas um mês
    return (30 / 12) * (salarioBase / 30); // Pelo menos 1 mês
  }
  
  // Cada mês trabalhado dá direito a 1/12 de 30 dias de férias
  const diasDeFerias = (meses * 30) / 12;
  
  // Valor das férias proporcionais = dias de férias * (salário / 30)
  return diasDeFerias * (salarioBase / 30);
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
