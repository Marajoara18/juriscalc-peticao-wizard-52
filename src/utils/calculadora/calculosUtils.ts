// Utility functions for handling calculation data

// Import the necessary functions from verbasRescisoriasUtils
import { calcularVerbasRescisorias } from './verbasRescisoriasUtils';
import { 
  calcularAdicionaisBasicos, 
  calcularMultas, 
  calcularJornada,
  calcularVerbasFeriasVencidas, 
  calcularBeneficios, 
  calcularDescontos,
  calcularBeneficiosSociais,
  calcularCustom
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
  
  // Calculate additional values
  const salarioBase = parseFloat(dadosContrato.salarioBase) || 0;
  
  // Separate calculations for different types of additionals
  const adicionaisBasicos = calcularAdicionaisBasicos(salarioBase, adicionais);
  const multas = calcularMultas(verbasRescisorias.total, adicionais);
  const jornada = calcularJornada(salarioBase, adicionais);
  const feriasVencidas = calcularVerbasFeriasVencidas(salarioBase, adicionais);
  const beneficios = calcularBeneficios(adicionais);
  const descontos = calcularDescontos(adicionais);
  const beneficiosSociais = calcularBeneficiosSociais(adicionais);
  const custom = calcularCustom(adicionais);
  
  // Combine all additionals
  const adicionaisValues = {
    ...adicionaisBasicos,
    ...multas,
    ...jornada,
    ...feriasVencidas,
    ...beneficios,
    ...descontos,
    ...beneficiosSociais,
    ...custom
  };
  
  // Return the final result
  const resultados = {
    verbasRescisorias,
    adicionais: adicionaisValues
  };

  // Log for debugging
  console.info("Cálculos realizados:", resultados);
  
  return resultados;
};
