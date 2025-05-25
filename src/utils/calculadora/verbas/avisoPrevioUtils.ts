
/**
 * Utilities for calculating prior notice values
 */
import { DadosContrato } from "@/types/calculadora";

/**
 * Calculates additional days of notice based on years worked
 * @param mesesTrabalhados Months worked
 * @returns Additional days (3 days per year worked, up to 60 additional days)
 */
const calcularDiasAdicionais = (mesesTrabalhados: number): number => {
  // Convert months to years (integer part)
  const anosCompletos = Math.floor(mesesTrabalhados / 12);
  // Calculate additional days (3 per year)
  const diasAdicionais = anosCompletos * 3;
  // Limit to 60 additional days (90 total - 30 base)
  return Math.min(diasAdicionais, 60);
};

/**
 * Calculates the prior notice value based on the contract type and if it was fulfilled
 * @param salarioBase Base salary
 * @param tipoRescisao Contract termination type
 * @param avisoPrevioCumprido Whether the prior notice was fulfilled
 * @param mesesTrabalhados Months worked (needed for calculating additional days)
 * @returns Prior notice value
 */
export const calcularAvisoPrevia = (
  salarioBase: number, 
  tipoRescisao: string, 
  avisoPrevioCumprido: boolean,
  mesesTrabalhados: number = 0
): number => {
  // Sem justa causa (empregador) ou rescisão indireta: empregador deve pagar se não cumpriu
  if ((tipoRescisao === 'sem_justa_causa' || tipoRescisao === 'rescisao_indireta') && !avisoPrevioCumprido) {
    // Base de 30 dias + adicionais (até 90 dias no total)
    const diasAdicionais = calcularDiasAdicionais(mesesTrabalhados);
    const totalDias = 30 + diasAdicionais;
    
    console.log(`Cálculo Aviso Prévio:`);
    console.log(`- Meses trabalhados: ${mesesTrabalhados}`);
    console.log(`- Anos completos: ${Math.floor(mesesTrabalhados / 12)}`);
    console.log(`- Dias adicionais: ${diasAdicionais}`);
    console.log(`- Total de dias: ${totalDias}`);
    
    // Valor diário x dias totais
    const valorDiario = salarioBase / 30;
    const valorTotal = valorDiario * totalDias;
    
    console.log(`- Valor diário: R$ ${valorDiario.toFixed(2)}`);
    console.log(`- Valor total aviso prévio: R$ ${valorTotal.toFixed(2)}`);
    
    return valorTotal;
  }
  // Pedido de demissão: empregado deve pagar se não cumprir
  else if (tipoRescisao === 'pedido_demissao' && !avisoPrevioCumprido) {
    return -salarioBase; // Valor negativo pois é um desconto ao empregado
  }
  return 0; // Se cumpriu o aviso ou é justa causa, não há pagamento
};
