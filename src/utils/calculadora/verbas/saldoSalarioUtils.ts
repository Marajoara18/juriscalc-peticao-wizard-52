
/**
 * Utilities for calculating salary balance
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
