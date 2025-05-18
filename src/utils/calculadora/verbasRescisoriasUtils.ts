
/**
 * Utilities for calculating rescission values
 */
import { DadosContrato } from "@/types/calculadora";
import { calcularDiasEntreDatas } from "@/utils/formatters";

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
 * Calculates the thirteenth salary proportional value based on months worked in the current year
 * @param salarioBase Base salary
 * @param dataAdmissao Admission date
 * @param dataDemissao Termination date
 * @param tipoRescisao Contract termination type
 * @returns Thirteenth salary value
 */
export const calcularDecimoTerceiro = (
  salarioBase: number, 
  dataAdmissao: string, 
  dataDemissao: string, 
  tipoRescisao: string
): number => {
  // Não tem direito em caso de justa causa
  if (tipoRescisao === 'justa_causa') {
    return 0;
  }
  
  // Obtém o ano atual da demissão
  const anoAtual = new Date(dataDemissao).getFullYear();
  
  // Data de início do período aquisitivo do 13º (1º de janeiro do ano atual)
  const inicioAno = new Date(anoAtual, 0, 1); // Janeiro é 0
  
  // Se foi admitido depois do início do ano, usa a data de admissão como início
  let dataInicio = new Date(dataAdmissao) > inicioAno ? new Date(dataAdmissao) : inicioAno;
  
  // Calcula os meses trabalhados no ano atual até a demissão
  const dataFim = new Date(dataDemissao);
  
  // Calcular a diferença de meses
  let meses = (dataFim.getFullYear() - dataInicio.getFullYear()) * 12;
  meses += dataFim.getMonth() - dataInicio.getMonth();
  
  // Se trabalhou mais de 15 dias no último mês, considera um mês completo
  const diasNoUltimoMes = dataFim.getDate() - (dataInicio.getDate() > dataFim.getDate() ? 0 : dataInicio.getDate());
  if (diasNoUltimoMes > 15) {
    meses += 1;
  }
  
  // Valor do 13º proporcional (1/12 do salário para cada mês trabalhado)
  return (salarioBase / 12) * meses;
};

/**
 * Calculates the proportional vacation value based on time worked since the last vacation period
 * @param salarioBase Base salary
 * @param dataAdmissao Admission date
 * @param dataDemissao Termination date
 * @param tipoRescisao Contract termination type
 * @returns Vacation value
 */
export const calcularFerias = (salarioBase: number, dataAdmissao: string, dataDemissao: string, tipoRescisao: string): number => {
  // Não tem direito a férias proporcionais em caso de justa causa com menos de 12 meses trabalhados
  if (tipoRescisao === 'justa_causa') {
    return 0;
  }
  
  const dataAdmissaoObj = new Date(dataAdmissao);
  const dataDemissaoObj = new Date(dataDemissao);
  
  // Determinar o último período aquisitivo completo (último aniversário de admissão)
  const ultimoPeriodoAquisitivo = new Date(dataAdmissaoObj);
  ultimoPeriodoAquisitivo.setFullYear(dataDemissaoObj.getFullYear());
  
  // Se a data de demissão é anterior ao aniversário de admissão no ano atual,
  // então o período aquisitivo completo terminou no ano anterior
  if (dataDemissaoObj < ultimoPeriodoAquisitivo) {
    ultimoPeriodoAquisitivo.setFullYear(ultimoPeriodoAquisitivo.getFullYear() - 1);
  }
  
  // Calcula os dias trabalhados desde o último período aquisitivo até a demissão
  const diasTrabalhados = calcularDiasEntreDatas(
    ultimoPeriodoAquisitivo.toISOString().split('T')[0], 
    dataDemissao
  );
  
  // Calcular meses trabalhados (considerando que 30 dias = 1 mês)
  const mesesTrabalhados = diasTrabalhados / 30;
  
  // Para férias, a proporção é de 1/12 do salário por mês trabalhado (2,5 dias por mês)
  // Total de dias de férias = meses trabalhados * 2,5 dias
  const diasDeFeriasProporcionais = mesesTrabalhados * 2.5;
  
  // Valor das férias proporcionais = dias de férias * (salário / 30)
  const valorFeriasProporcionais = diasDeFeriasProporcionais * (salarioBase / 30);
  
  return valorFeriasProporcionais;
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
  
  // Usando nova implementação do décimo terceiro baseada nos meses trabalhados no ano corrente
  const decimoTerceiro = calcularDecimoTerceiro(
    salarioBase, 
    dadosContrato.dataAdmissao, 
    dadosContrato.dataDemissao, 
    dadosContrato.tipoRescisao
  );
  
  // Usamos a nova função de férias que considera o período desde o último período aquisitivo
  const ferias = calcularFerias(
    salarioBase, 
    dadosContrato.dataAdmissao, 
    dadosContrato.dataDemissao, 
    dadosContrato.tipoRescisao
  );
  
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
    ferias, // Agora férias proporcionais baseadas no último período aquisitivo
    tercoConstitucional,
    fgts,
    multaFgts,
    total
  };
};
