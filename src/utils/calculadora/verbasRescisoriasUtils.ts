
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
  calcularVerbasRescisorias
};
