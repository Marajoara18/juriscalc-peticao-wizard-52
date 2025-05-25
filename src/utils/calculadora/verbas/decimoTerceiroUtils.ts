
/**
 * Utilities for calculating 13th salary
 */
import { DadosContrato } from "@/types/calculadora";

/**
 * Calculates the thirteenth salary proportional value based on complete months worked
 * Formula: (Salário Base / 12) × Meses Completos Trabalhados
 * 
 * Steps:
 * 1. Count complete months worked from admission to termination date
 * 2. For each complete month, add 1/12 of the monthly 13th salary
 * 3. Calculate: (Base Salary / 12) × Complete Months Worked
 * 
 * Example:
 * - Base Salary: R$ 1,000.00
 * - Admission: 2024-01-15, Termination: 2024-08-20
 * - Complete Months: 7 months (Jan, Feb, Mar, Apr, May, Jun, Jul)
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
  
  // Contar meses completos trabalhados
  let mesesCompletos = 0;
  
  // Criar data atual para iterar mês a mês
  const dataAtual = new Date(dataAdmissaoObj.getFullYear(), dataAdmissaoObj.getMonth(), 1);
  const dataFim = new Date(dataDemissaoObj.getFullYear(), dataDemissaoObj.getMonth(), 1);
  
  // Iterar mês a mês contando os meses completos
  while (dataAtual <= dataFim) {
    const ultimoDiaDoMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 0).getDate();
    
    // Verificar se o mês foi trabalhado completamente
    let inicioMes: Date;
    let fimMes: Date;
    
    if (dataAtual.getTime() === new Date(dataAdmissaoObj.getFullYear(), dataAdmissaoObj.getMonth(), 1).getTime()) {
      // Primeiro mês - começar da data de admissão
      inicioMes = dataAdmissaoObj;
    } else {
      // Outros meses - começar do dia 1
      inicioMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);
    }
    
    if (dataAtual.getTime() === dataFim.getTime()) {
      // Último mês - terminar na data de demissão
      fimMes = dataDemissaoObj;
    } else {
      // Outros meses - terminar no último dia do mês
      fimMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), ultimoDiaDoMes);
    }
    
    // Calcular dias trabalhados no mês
    const diasTrabalhados = Math.floor((fimMes.getTime() - inicioMes.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Considerar mês completo se trabalhou mais de 15 dias
    if (diasTrabalhados > 15) {
      mesesCompletos++;
    }
    
    console.log(`Mês ${dataAtual.getMonth() + 1}/${dataAtual.getFullYear()}: ${diasTrabalhados} dias trabalhados ${diasTrabalhados > 15 ? '(mês completo)' : '(mês incompleto)'}`);
    
    // Avançar para o próximo mês
    dataAtual.setMonth(dataAtual.getMonth() + 1);
  }
  
  // Garantir que não seja negativo ou zero
  if (mesesCompletos <= 0) {
    mesesCompletos = 1;
  }
  
  // Aplicar a fórmula: (Salário Base / 12) × Meses Completos Trabalhados
  const valorMensal13 = salarioBase / 12;
  const decimoTerceiroProporcional = valorMensal13 * mesesCompletos;
  
  console.log(`Cálculo 13º salário: Salário Base (${salarioBase}) / 12 = ${valorMensal13.toFixed(2)} × ${mesesCompletos} meses completos = ${decimoTerceiroProporcional.toFixed(2)}`);
  
  return decimoTerceiroProporcional;
};
