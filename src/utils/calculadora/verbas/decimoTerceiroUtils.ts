
/**
 * Utilities for calculating 13th salary
 */
import { DadosContrato } from "@/types/calculadora";

/**
 * Calculates the thirteenth salary proportional value based on months worked
 * Formula: (Salário Base / 12) × Meses Trabalhados
 * 
 * Steps:
 * 1. Divide the base salary by 12 to get the monthly 13th salary value
 * 2. Multiply this monthly value by the number of months worked
 * 
 * Example:
 * - Base Salary: R$ 1,000.00
 * - Months Worked: 7 months
 * - Calculation: (1000 / 12) × 7 = 583.33
 * - Result: R$ 583.33
 * 
 * @param salarioBase Base salary
 * @param dataAdmissao Admission date
 * @param dataDemissao Termination date
 * @param tipoRescisao Contract termination type
 * @returns Thirteenth salary proportional value
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
  
  // Aplicar a fórmula: (Salário Base / 12) × Meses Trabalhados
  const valorMensal13 = salarioBase / 12;
  const decimoTerceiroProporcional = valorMensal13 * mesesTrabalhados;
  
  console.log(`Cálculo 13º salário: Salário Base (${salarioBase}) / 12 = ${valorMensal13.toFixed(2)} × ${mesesTrabalhados} meses = ${decimoTerceiroProporcional.toFixed(2)}`);
  
  return decimoTerceiroProporcional;
};
