
/**
 * Utilities for calculating social benefits
 */
import { 
  VALOR_MAXIMO_SEGURO_DESEMPREGO, 
  FAIXA_1_SEGURO_DESEMPREGO, 
  FAIXA_2_SEGURO_DESEMPREGO,
  VALOR_SALARIO_FAMILIA,
  LIMITE_SALARIO_FAMILIA
} from '@/utils/calculadoraConstants';

/**
 * Calculates unemployment insurance
 */
export const calcularSeguroDesemprego = (
  calcular: boolean,
  tipoRescisao: string, 
  ultimoSalario: number, 
  mesesTrabalhadosUltimoEmprego: number, 
  tempoContribuicaoINSS: number
): number => {
  if (!calcular) return 0;
  
  // Verifica se é elegível com base no tipo de rescisão
  const elegivel = tipoRescisao === 'sem_justa_causa' || tipoRescisao === 'rescisao_indireta';
  
  if (!elegivel) return 0;
  
  let parcelas = 0;
  
  // Determinar número de parcelas com base no tempo de trabalho
  if (tempoContribuicaoINSS < 1) {
    if (mesesTrabalhadosUltimoEmprego >= 12 && mesesTrabalhadosUltimoEmprego < 24) {
      parcelas = 4;
    }
  } else if (tempoContribuicaoINSS >= 1 && tempoContribuicaoINSS < 2) {
    if (mesesTrabalhadosUltimoEmprego >= 9) {
      parcelas = 5;
    }
  } else if (tempoContribuicaoINSS >= 2) {
    if (mesesTrabalhadosUltimoEmprego >= 6) {
      parcelas = 5;
    }
  }
  
  // Cálculo do valor da parcela
  let valorParcela = 0;
  
  if (ultimoSalario <= FAIXA_1_SEGURO_DESEMPREGO) {
    valorParcela = ultimoSalario * 0.8;
  } else if (ultimoSalario <= FAIXA_2_SEGURO_DESEMPREGO) {
    valorParcela = (FAIXA_1_SEGURO_DESEMPREGO * 0.8) + ((ultimoSalario - FAIXA_1_SEGURO_DESEMPREGO) * 0.5);
  } else {
    valorParcela = VALOR_MAXIMO_SEGURO_DESEMPREGO; // Valor máximo da parcela em 2024
  }
  
  // Valor total do seguro-desemprego
  return valorParcela * parcelas;
};

/**
 * Calculates family salary benefit
 */
export const calcularSalarioFamilia = (
  calcular: boolean,
  salarioBase: number,
  quantidadeFilhos: number
): number => {
  if (!calcular || salarioBase > LIMITE_SALARIO_FAMILIA || quantidadeFilhos <= 0) {
    return 0;
  }
  
  // Cálculo do valor do salário-família
  return VALOR_SALARIO_FAMILIA * quantidadeFilhos;
};
