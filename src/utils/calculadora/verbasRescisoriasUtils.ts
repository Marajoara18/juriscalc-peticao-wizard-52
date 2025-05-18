
/**
 * Utilities for calculating rescission values
 */
import { DadosContrato } from "@/types/calculadora";

/**
 * Calculates the salary balance based on the monthly salary and days worked
 * @param salarioBase Base salary
 * @param diasTrabalhados Days worked in the last month
 * @returns Salary balance
 */
export const calcularSaldoSalario = (salarioBase: number, diasTrabalhados: number): number => {
  return (salarioBase / 30) * diasTrabalhados;
};

/**
 * Calculates the prior notice value based on the contract type
 * @param salarioBase Base salary
 * @param tipoRescisao Contract termination type
 * @returns Prior notice value
 */
export const calcularAvisoPrevia = (salarioBase: number, tipoRescisao: string): number => {
  return (tipoRescisao === 'sem_justa_causa' || tipoRescisao === 'rescisao_indireta') 
    ? salarioBase
    : 0;
};

/**
 * Calculates the thirteenth salary proportional value
 * @param salarioBase Base salary
 * @param mesesTrabalhados Months worked
 * @returns Thirteenth salary value
 */
export const calcularDecimoTerceiro = (salarioBase: number, mesesTrabalhados: number): number => {
  return (salarioBase / 12) * mesesTrabalhados;
};

/**
 * Calculates the proportional vacation value
 * @param salarioBase Base salary
 * @param mesesTrabalhados Months worked
 * @returns Vacation value
 */
export const calcularFerias = (salarioBase: number, mesesTrabalhados: number): number => {
  return (salarioBase / 12) * mesesTrabalhados;
};

/**
 * Calculates the constitutional third of vacation
 * @param valorFerias Vacation value
 * @returns Constitutional third
 */
export const calcularTercoConstitucional = (valorFerias: number): number => {
  return valorFerias / 3;
};

/**
 * Calculates the FGTS value
 * @param salarioBase Base salary
 * @param mesesTrabalhados Months worked
 * @returns FGTS value
 */
export const calcularFGTS = (salarioBase: number, mesesTrabalhados: number): number => {
  return salarioBase * 0.08 * mesesTrabalhados;
};

/**
 * Calculates the FGTS fine
 * @param valorFGTS FGTS value
 * @param tipoRescisao Contract termination type
 * @returns FGTS fine value
 */
export const calcularMultaFGTS = (valorFGTS: number, tipoRescisao: string): number => {
  return (tipoRescisao === 'sem_justa_causa' || tipoRescisao === 'rescisao_indireta') 
    ? valorFGTS * 0.4
    : 0;
};

/**
 * Calculates all rescission values
 * @param dadosContrato Contract data
 * @returns Object with all rescission values and total
 */
export const calcularVerbasRescisorias = (dadosContrato: DadosContrato) => {
  const salarioBase = parseFloat(dadosContrato.salarioBase) || 0;
  const diasTrabalhados = parseInt(dadosContrato.diasTrabalhados) || 0;
  const mesesTrabalhados = parseInt(dadosContrato.mesesTrabalhados) || 0;
  
  // Cálculo individual das verbas
  const saldoSalario = calcularSaldoSalario(salarioBase, diasTrabalhados);
  const avisoPrevia = calcularAvisoPrevia(salarioBase, dadosContrato.tipoRescisao);
  const decimoTerceiro = calcularDecimoTerceiro(salarioBase, mesesTrabalhados);
  const ferias = calcularFerias(salarioBase, mesesTrabalhados);
  const tercoConstitucional = calcularTercoConstitucional(ferias);
  const fgts = calcularFGTS(salarioBase, mesesTrabalhados);
  const multaFgts = calcularMultaFGTS(fgts, dadosContrato.tipoRescisao);
  
  // Cálculo do total
  const total = saldoSalario + avisoPrevia + decimoTerceiro + ferias + tercoConstitucional + fgts + multaFgts;
  
  return {
    saldoSalario,
    avisoPrevia,
    decimoTerceiro,
    ferias,
    tercoConstitucional,
    fgts,
    multaFgts,
    total
  };
};
