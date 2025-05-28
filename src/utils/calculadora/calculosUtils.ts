
// Utility functions for handling calculation data

// Import the necessary functions from verbasRescisoriasUtils
import { calcularVerbasRescisorias } from './verbas/calculadoraVerbas';
import { 
  calcularAdicionais,
  calcularSeguroDesempregoHelper,
  calcularSalarioFamiliaHelper
} from './adicionaisUtils';

/**
 * Performs all calculations based on contract data and additional values.
 * @param dadosContrato Contract data
 * @param adicionais Additional values to calculate
 * @returns Object with all calculated values
 */
export const realizarCalculos = (dadosContrato: any, adicionais: any) => {
  console.info("Calculando com:", {
    salarioBase: parseFloat(dadosContrato.salarioBase),
    diasTrabalhados: parseInt(dadosContrato.diasTrabalhados),
    mesesTrabalhados: parseInt(dadosContrato.mesesTrabalhados)
  });
  
  // Calculate rescission values
  const verbasRescisorias = calcularVerbasRescisorias(dadosContrato);
  
  // Calculate additional values based on the main salary
  const salarioBase = parseFloat(dadosContrato.salarioBase) || 0;
  
  // Get all values from verbasRescisorias to pass to calcularAdicionais
  const saldoSalario = verbasRescisorias.saldoSalario || 0;
  const avisoPrevia = verbasRescisorias.avisoPrevia || 0;
  const decimoTerceiro = verbasRescisorias.decimoTerceiro || 0;
  const ferias = verbasRescisorias.ferias || 0;
  const tercoConstitucional = verbasRescisorias.tercoConstitucional || 0;
  
  // Calculate all additionals using the main function - now passing dadosContrato
  const adicionaisValues = calcularAdicionais(
    salarioBase, 
    adicionais,
    saldoSalario,
    avisoPrevia,
    decimoTerceiro,
    ferias,
    tercoConstitucional,
    dadosContrato // Pass contract data for period calculations
  );
  
  // Return the final result
  const resultados = {
    verbasRescisorias,
    adicionais: adicionaisValues
  };

  // Log for debugging
  console.info("Cálculos realizados:", resultados);
  
  return resultados;
};
