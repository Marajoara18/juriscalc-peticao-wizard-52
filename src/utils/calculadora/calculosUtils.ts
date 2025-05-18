
/**
 * Utility functions for calculation operations
 */
import { DadosContrato, Adicionais, Resultados, CustomCalculo } from '@/types/calculadora';
import { calcularVerbasRescisorias } from '@/utils/calculadora/verbasRescisoriasUtils';
import { calcularAdicionais } from '@/utils/calculadora/adicionaisUtils';
import { resultadosIniciais } from '@/utils/calculadoraConstants';

/**
 * Performs all calculation operations and returns the results
 * @param dadosContrato Contract data for calculations
 * @param adicionais Additional values for calculations
 * @returns Calculated results
 */
export const realizarCalculos = (
  dadosContrato: DadosContrato,
  adicionais: Adicionais
): Resultados => {
  try {
    // Extrair valores numéricos
    const salarioBase = parseFloat(dadosContrato.salarioBase) || 0;
    const diasTrabalhados = parseInt(dadosContrato.diasTrabalhados) || 0;
    const mesesTrabalhados = parseInt(dadosContrato.mesesTrabalhados) || 0;
    
    console.log("Calculando com:", { salarioBase, diasTrabalhados, mesesTrabalhados });

    // Cálculo das verbas rescisórias
    const verbasRescisorias = calcularVerbasRescisorias(dadosContrato);
    
    // Cálculo dos adicionais
    const adicionaisCalculados = calcularAdicionais(
      salarioBase, 
      adicionais, 
      verbasRescisorias.saldoSalario, 
      verbasRescisorias.avisoPrevia, 
      verbasRescisorias.decimoTerceiro, 
      verbasRescisorias.ferias, 
      verbasRescisorias.tercoConstitucional
    );

    return {
      verbasRescisorias,
      adicionais: adicionaisCalculados
    };
  } catch (error) {
    console.error("Erro ao realizar cálculos:", error);
    return resultadosIniciais;
  }
};
