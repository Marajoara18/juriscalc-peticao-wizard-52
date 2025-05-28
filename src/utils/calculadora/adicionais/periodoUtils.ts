
/**
 * Utilities for calculating additionals based on specific periods
 */

/**
 * Calculates the number of months between two dates
 */
export const calcularMesesEntreDatas = (dataInicio: string, dataFim: string): number => {
  if (!dataInicio || !dataFim) return 0;
  
  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);
  
  if (inicio > fim) return 0;
  
  const diffTime = fim.getTime() - inicio.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Convert days to months (approximate)
  return Math.round(diffDays / 30);
};

/**
 * Calculates the proportion of the specific period within the total contract period
 */
export const calcularProporcaoPeriodo = (
  dataAdmissao: string,
  dataDemissao: string,
  dataInicioPeriodo: string,
  dataFimPeriodo: string
): number => {
  if (!dataAdmissao || !dataDemissao || !dataInicioPeriodo || !dataFimPeriodo) {
    return 1; // Se não há período específico, aplica 100%
  }
  
  const admissao = new Date(dataAdmissao);
  const demissao = new Date(dataDemissao);
  const inicioPeriodo = new Date(dataInicioPeriodo);
  const fimPeriodo = new Date(dataFimPeriodo);
  
  // Ajusta as datas do período para não exceder o período do contrato
  const inicioEfetivo = inicioPeriodo < admissao ? admissao : inicioPeriodo;
  const fimEfetivo = fimPeriodo > demissao ? demissao : fimPeriodo;
  
  if (inicioEfetivo > fimEfetivo) return 0;
  
  // Calcula os dias totais do contrato
  const diasTotaisContrato = Math.ceil((demissao.getTime() - admissao.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calcula os dias do período específico
  const diasPeriodoEspecifico = Math.ceil((fimEfetivo.getTime() - inicioEfetivo.getTime()) / (1000 * 60 * 60 * 24));
  
  // Retorna a proporção
  return diasTotaisContrato > 0 ? diasPeriodoEspecifico / diasTotaisContrato : 0;
};

/**
 * Calculates insalubrity with specific period consideration
 */
export const calcularInsalubridadeComPeriodo = (
  salarioBase: number,
  grauInsalubridade: string,
  baseCalculoInsalubridade: string,
  periodoEspecifico: boolean,
  dataAdmissao: string,
  dataDemissao: string,
  dataInicio?: string,
  dataFim?: string
): number => {
  // Import the base calculation
  const { calcularInsalubridade } = require('./insalubridadeUtils');
  
  // Calculate the base value
  const valorBase = calcularInsalubridade(salarioBase, grauInsalubridade, baseCalculoInsalubridade);
  
  // If no specific period, return full value
  if (!periodoEspecifico || !dataInicio || !dataFim) {
    return valorBase;
  }
  
  // Calculate the proportion for the specific period
  const proporcao = calcularProporcaoPeriodo(dataAdmissao, dataDemissao, dataInicio, dataFim);
  
  return valorBase * proporcao;
};

/**
 * Calculates dangerousness with specific period consideration
 */
export const calcularPericulosidadeComPeriodo = (
  salarioBase: number,
  percentualPericulosidade: number,
  baseCalculoPericulosidade: string,
  periodoEspecifico: boolean,
  dataAdmissao: string,
  dataDemissao: string,
  dataInicio?: string,
  dataFim?: string
): number => {
  // Import the base calculation
  const { calcularPericulosidade } = require('./periculosidadeUtils');
  
  // Calculate the base value
  const valorBase = calcularPericulosidade(salarioBase, percentualPericulosidade, baseCalculoPericulosidade);
  
  // If no specific period, return full value
  if (!periodoEspecifico || !dataInicio || !dataFim) {
    return valorBase;
  }
  
  // Calculate the proportion for the specific period
  const proporcao = calcularProporcaoPeriodo(dataAdmissao, dataDemissao, dataInicio, dataFim);
  
  return valorBase * proporcao;
};
