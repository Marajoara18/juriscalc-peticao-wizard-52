
/**
 * Utilities for calculating contract termination indemnification
 */
import { DadosContrato } from "@/types/calculadora";

/**
 * Calculates the indemnification for contract breach in fixed-term contracts
 * @param salarioBase Base salary
 * @param mesesRestantes Remaining months of the contract
 * @returns Indemnification value for contract breach
 */
export const calcularIndenizacaoQuebraContrato = (
  salarioBase: number, 
  mesesRestantes: number
): number => {
  // Indenização = (Salário ÷ 2) × Meses restantes
  const indenizacao = (salarioBase / 2) * mesesRestantes;
  
  console.log(`Cálculo Indenização Quebra de Contrato:`);
  console.log(`- Salário base: R$ ${salarioBase.toFixed(2)}`);
  console.log(`- Meses restantes: ${mesesRestantes}`);
  console.log(`- Indenização: (${salarioBase} ÷ 2) × ${mesesRestantes} = R$ ${indenizacao.toFixed(2)}`);
  
  return indenizacao;
};
