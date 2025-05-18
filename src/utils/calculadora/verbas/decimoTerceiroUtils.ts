
/**
 * Utilities for calculating 13th salary
 */
import { DadosContrato } from "@/types/calculadora";

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
