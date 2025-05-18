
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
  
  // Determinar o último período aquisitivo completo (último aniversário de admissão)
  const ultimoPeriodoAquisitivo = new Date(dataAdmissaoObj);
  ultimoPeriodoAquisitivo.setFullYear(dataDemissaoObj.getFullYear());
  
  // Se a data de demissão é anterior ao aniversário de admissão no ano atual,
  // então o período aquisitivo completo terminou no ano anterior
  if (dataDemissaoObj < ultimoPeriodoAquisitivo) {
    ultimoPeriodoAquisitivo.setFullYear(ultimoPeriodoAquisitivo.getFullYear() - 1);
  }
  
  // Calcula os meses trabalhados desde o último período aquisitivo até a demissão
  let mesesTrabalhados = (dataDemissaoObj.getFullYear() - ultimoPeriodoAquisitivo.getFullYear()) * 12;
  mesesTrabalhados += dataDemissaoObj.getMonth() - ultimoPeriodoAquisitivo.getMonth();
  
  // Se trabalhou mais de 15 dias no último mês, considera um mês completo
  const diasNoUltimoMes = dataDemissaoObj.getDate() - ultimoPeriodoAquisitivo.getDate();
  if (diasNoUltimoMes > 15) {
    mesesTrabalhados += 1;
  }
  
  // Cada mês trabalhado dá direito a 1/12 de 30 dias de férias
  const diasDeFerias = (mesesTrabalhados * 30) / 12;
  
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
