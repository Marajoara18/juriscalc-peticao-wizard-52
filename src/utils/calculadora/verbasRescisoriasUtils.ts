
/**
 * Facade for rescission values calculation utilities
 */
import { DadosContrato } from "@/types/calculadora";
import { calcularSaldoSalario } from "./verbas/saldoSalarioUtils";
import { calcularAvisoPrevia } from "./verbas/avisoPrevioUtils";
import { calcularDecimoTerceiro } from "./verbas/decimoTerceiroUtils";
import { calcularFerias, calcularFeriasVencidas, calcularTercoConstitucional } from "./verbas/feriasUtils";
import { calcularFGTS, calcularMultaFGTS } from "./verbas/fgtsUtils";
import { calcularVerbasRescisorias } from "./verbas/calculadoraVerbas";
import { calcularHonorariosAdvocaticios } from "./adicionaisUtils";

/**
 * Utility function to adjust months based on days worked
 * If days worked are more than 15, consider it a full month
 * @param months Number of months
 * @param days Number of days in the last month
 * @returns Adjusted number of months
 */
export const ajustarMesesPorDias = (months: number, days: number): number => {
  return days > 15 ? Math.ceil(months) : months;
};

// Re-export everything from the individual modules for backward compatibility
export {
  calcularSaldoSalario,
  calcularAvisoPrevia,
  calcularDecimoTerceiro,
  calcularFerias,
  calcularFeriasVencidas,
  calcularTercoConstitucional,
  calcularFGTS,
  calcularMultaFGTS,
  calcularVerbasRescisorias,
  calcularHonorariosAdvocaticios
};
