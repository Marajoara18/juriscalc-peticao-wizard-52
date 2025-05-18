
/**
 * Utilities for calculating CLT fines
 */

/**
 * Calculates Art. 467 CLT fine
 */
export const calcularMulta467 = (
  calcular: boolean,
  saldoSalario: number,
  avisoPrevia: number,
  decimoTerceiro: number,
  ferias: number,
  tercoConstitucional: number
): number => {
  if (!calcular) return 0;
  
  return (saldoSalario + avisoPrevia + decimoTerceiro + ferias + tercoConstitucional) * 0.5;
};

/**
 * Calculates Art. 477 CLT fine
 */
export const calcularMulta477 = (calcular: boolean, salarioBase: number): number => {
  if (!calcular) return 0;
  
  return salarioBase;
};
