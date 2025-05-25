
/**
 * Utilities for calculating 13th salary
 */
import { DadosContrato } from "@/types/calculadora";

/**
 * Calculates the thirteenth salary proportional value based on months worked in the current year
 * Formula: (Salário Bruto / 12) × Meses Trabalhados
 * Exception: If worked period is 12 complete months, proportional 13th salary should not be calculated
 * @param salarioBase Base salary
 * @param dataAdmissao Admission date
 * @param dataDemissao Termination date
 * @param tipoRescisao Contract termination type
 * @returns Thirteenth salary value
 */
export const calcularDecimoTerceiro = (
  salarioBase: number, 
  dataAdmissao: string, 
  dataDemissao: string, 
  tipoRescisao: string
): number => {
  // Não tem direito em caso de justa causa
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
  
  // Se o período trabalhado foi de 12 meses completos, não calcular o 13º proporcional
  if (mesesTrabalhados >= 12) {
    return 0;
  }
  
  // Fórmula: (Salário Bruto / 12) × Meses Trabalhados
  return (salarioBase / 12) * mesesTrabalhados;
};
