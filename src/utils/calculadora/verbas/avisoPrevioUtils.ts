
/**
 * Utilities for calculating prior notice values
 */
import { DadosContrato } from "@/types/calculadora";

/**
 * Calculates the prior notice value based on the contract type and if it was fulfilled
 * @param salarioBase Base salary
 * @param tipoRescisao Contract termination type
 * @param avisoPrevioCumprido Whether the prior notice was fulfilled
 * @returns Prior notice value
 */
export const calcularAvisoPrevia = (salarioBase: number, tipoRescisao: string, avisoPrevioCumprido: boolean): number => {
  // Sem justa causa (empregador) ou rescisão indireta: empregador deve pagar se não cumpriu
  if ((tipoRescisao === 'sem_justa_causa' || tipoRescisao === 'rescisao_indireta') && !avisoPrevioCumprido) {
    return salarioBase;
  }
  // Pedido de demissão: empregado deve pagar se não cumprir
  else if (tipoRescisao === 'pedido_demissao' && !avisoPrevioCumprido) {
    return -salarioBase; // Valor negativo pois é um desconto ao empregado
  }
  return 0; // Se cumpriu o aviso ou é justa causa, não há pagamento
};
