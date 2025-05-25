
/**
 * Utilities for calculating additional values related to work hours
 */
import { ajustarMesesPorDias } from "../verbasRescisoriasUtils";
import { HorasExtrasCalculo } from '@/types/calculadora';

/**
 * Calculates night shift premium
 */
export const calcularAdicionalNoturno = (
  calcular: boolean,
  percentual: string,
  horasNoturnas: string,
  salarioBase: number
): number => {
  if (!calcular) return 0;
  
  const percentualAdicional = parseFloat(percentual) / 100 || 0.2; // Default 20%
  const qtdHorasNoturnas = parseInt(horasNoturnas) || 0;
  const valorHoraNormal = salarioBase / 220; // 220 horas mensais padrão
  
  return valorHoraNormal * percentualAdicional * qtdHorasNoturnas;
};

/**
 * Calculates overtime
 */
export const calcularHorasExtras = (
  calcular: boolean,
  percentual: string,
  quantidadeHoras: string,
  salarioBase: number
): number => {
  if (!calcular) return 0;
  
  const percentualAdicional = parseFloat(percentual) / 100 || 0.5; // Default 50%
  const qtdHoras = parseFloat(quantidadeHoras) || 0;
  const valorHoraNormal = salarioBase / 220; // 220 horas mensais padrão
  
  return valorHoraNormal * (1 + percentualAdicional) * qtdHoras;
};

/**
 * Calculates multiple overtime calculations
 */
export const calcularHorasExtrasMultiplas = (
  calcular: boolean,
  horasExtrasCalculos: HorasExtrasCalculo[],
  salarioBase: number
): number => {
  if (!calcular || !horasExtrasCalculos || horasExtrasCalculos.length === 0) return 0;
  
  const valorHoraNormal = salarioBase / 220; // 220 horas mensais padrão
  
  return horasExtrasCalculos.reduce((total, calculo) => {
    const percentualAdicional = parseFloat(calculo.percentual) / 100 || 0.5;
    const qtdHoras = parseFloat(calculo.quantidade) || 0;
    const valorCalculo = valorHoraNormal * (1 + percentualAdicional) * qtdHoras;
    
    console.log(`Calculando horas extras: ${qtdHoras}h a ${calculo.percentual}% = R$ ${valorCalculo.toFixed(2)}`);
    
    return total + valorCalculo;
  }, 0);
};

/**
 * Calculates expired vacation value
 */
export const calcularFeriasVencidas = (
  calcular: boolean,
  periodos: string,
  salarioBase: number,
  diasNoUltimoMes: number = 0
): number => {
  if (!calcular) return 0;
  
  // Quantidade de períodos aquisitivos vencidos não gozados
  let qtdPeriodos = parseInt(periodos) || 1;
  
  // Aplicar a regra dos 15 dias se o período incluir dias parciais
  if (diasNoUltimoMes > 15) {
    qtdPeriodos = Math.ceil(qtdPeriodos);
  }
  
  // Cada período vencido equivale a um salário + 1/3 constitucional
  return salarioBase * qtdPeriodos * (1 + 1/3);
};

/**
 * Calculates dismissal indemnity
 */
export const calcularIndenizacaoDemissao = (
  calcular: boolean,
  valorIndenizacao: string,
  salarioBase: number
): number => {
  if (!calcular) return 0;
  
  // Se o usuário definiu um valor específico, usar esse valor
  const valorDefinido = parseFloat(valorIndenizacao);
  if (valorDefinido && !isNaN(valorDefinido)) {
    return valorDefinido;
  }
  
  // Se não definiu valor, usa um salário como padrão
  return salarioBase;
};

/**
 * Calculates transfer premium
 */
export const calcularAdicionalTransferencia = (
  calcular: boolean,
  percentual: string,
  salarioBase: number,
  diasNoUltimoMes: number = 0
): number => {
  if (!calcular) return 0;
  
  const percentualAdicional = parseFloat(percentual) / 100 || 0.25; // Default 25%
  
  // Aplicamos a regra dos 15 dias para considerar mês completo
  // se aplicável (quando há dias parciais)
  if (diasNoUltimoMes > 0) {
    // Se trabalhou mais de 15 dias, considera um mês completo
    const fatorMes = diasNoUltimoMes > 15 ? 1 : diasNoUltimoMes / 30;
    return salarioBase * percentualAdicional * fatorMes;
  }
  
  return salarioBase * percentualAdicional;
};
