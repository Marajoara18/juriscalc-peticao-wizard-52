
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

/**
 * Calculates the thirteenth salary proportional value
 * @param salarioBase Base salary
 * @param mesesTrabalhados Months worked
 * @param tipoRescisao Contract termination type
 * @returns Thirteenth salary value
 */
export const calcularDecimoTerceiro = (salarioBase: number, mesesTrabalhados: number, tipoRescisao: string): number => {
  // Não tem direito em caso de justa causa, a menos que tenha trabalhado mais de 12 meses
  if (tipoRescisao === 'justa_causa' && mesesTrabalhados <= 12) {
    return 0;
  }
  // Se trabalhou mais de 15 dias no último mês, considera um mês completo
  const diasTrabalhados = parseInt(mesesTrabalhados.toString().split('.')[1] || '0');
  const mesesEfetivos = Math.floor(mesesTrabalhados) + (diasTrabalhados > 15 ? 1 : 0);
  
  return (salarioBase / 12) * mesesEfetivos;
};

/**
 * Calculates the proportional vacation value
 * @param salarioBase Base salary
 * @param mesesTrabalhados Months worked
 * @param tipoRescisao Contract termination type
 * @returns Vacation value
 */
export const calcularFerias = (salarioBase: number, mesesTrabalhados: number, tipoRescisao: string): number => {
  // Não tem direito a férias proporcionais em caso de justa causa, a menos que tenha trabalhado mais de 12 meses
  if (tipoRescisao === 'justa_causa' && mesesTrabalhados <= 12) {
    return 0;
  }
  
  // Férias proporcionais ao tempo trabalhado no ano da rescisão
  // O cálculo é feito sobre 1 ano completo (12 meses)
  return (salarioBase / 12) * mesesTrabalhados;
};

/**
 * Calculates expired vacation value - Moved to adicionaisUtils.ts
 * This function remains here for backward compatibility but doesn't calculate anymore
 * @param salarioBase Base salary
 * @param feriasVencidas Whether there are expired vacations
 * @returns Always returns 0 now
 */
export const calcularFeriasVencidas = (salarioBase: number, feriasVencidas: boolean): number => {
  // This functionality is now handled in the adicionais module
  return 0;
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
  const avisoPrevioCumprido = dadosContrato.aviso_previo_cumprido || false;
  
  // Cálculo individual das verbas
  const saldoSalario = calcularSaldoSalario(salarioBase, diasTrabalhados);
  const avisoPrevia = calcularAvisoPrevia(salarioBase, dadosContrato.tipoRescisao, avisoPrevioCumprido);
  const decimoTerceiro = calcularDecimoTerceiro(salarioBase, mesesTrabalhados, dadosContrato.tipoRescisao);
  const ferias = calcularFerias(salarioBase, mesesTrabalhados, dadosContrato.tipoRescisao);
  const tercoConstitucional = calcularTercoConstitucional(ferias);
  const fgts = calcularFGTS(salarioBase, mesesTrabalhados);
  const multaFgts = calcularMultaFGTS(fgts, dadosContrato.tipoRescisao);
  
  // Para o cálculo do total e a visualização, tratamos o aviso prévio diferentemente
  // dependendo do tipo de rescisão
  let avisoPrevia_ajustado = avisoPrevia;
  let descontoAvisoPrevio = 0;
  
  // No caso de pedido de demissão, o aviso prévio é um desconto (valor negativo)
  // se não for cumprido, mas precisamos armazenar isso separadamente
  if (dadosContrato.tipoRescisao === 'pedido_demissao' && !avisoPrevioCumprido) {
    avisoPrevia_ajustado = 0; // Não aparece como verba positiva
    descontoAvisoPrevio = Math.abs(avisoPrevia); // Armazena como desconto
  }
  
  // Cálculo do total (excluindo descontos)
  const total = saldoSalario + avisoPrevia_ajustado + decimoTerceiro + ferias + tercoConstitucional + fgts + multaFgts;
  
  return {
    saldoSalario,
    avisoPrevia: avisoPrevia_ajustado, // Armazena apenas o valor positivo para exibição
    descontoAvisoPrevio, // Novo campo para armazenar o desconto do aviso prévio
    decimoTerceiro,
    ferias, // Agora apenas férias proporcionais
    tercoConstitucional,
    fgts,
    multaFgts,
    total
  };
};
