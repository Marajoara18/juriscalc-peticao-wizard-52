
/**
 * Utilities for calculating 13th salary
 */
import { DadosContrato } from "@/types/calculadora";

/**
 * Calculates the thirteenth salary proportional value based on months worked in the current year
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
  
  // Consideramos a quantidade de meses como o mês da demissão (1-indexed)
  const meses = dataDemissaoObj.getMonth() + 1;
  
  // Se admissão ocorreu no mesmo ano, ajustar para não contar meses antes da contratação
  if (dataAdmissaoObj.getFullYear() === dataDemissaoObj.getFullYear()) {
    const mesesAdmissao = dataAdmissaoObj.getMonth() + 1;
    // Se meses da demissão for maior, subtrair meses antes da admissão e adicionar 1 para incluir o mês de admissão
    if (meses > mesesAdmissao) {
      return (salarioBase / 12) * (meses - mesesAdmissao + 1);
    }
    // Se for igual ou menor, considerar apenas meses trabalhados
    return (salarioBase / 12) * 1; // Pelo menos 1 mês
  }
  
  // Valor do 13º proporcional (1/12 do salário para cada mês trabalhado)
  return (salarioBase / 12) * meses;
};
