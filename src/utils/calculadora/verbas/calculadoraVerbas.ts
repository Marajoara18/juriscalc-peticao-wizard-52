
/**
 * Main calculator for rescission values
 */
import { DadosContrato, RescisionValues } from "@/types/calculadora";
import { calcularSaldoSalario } from "./saldoSalarioUtils";
import { calcularAvisoPrevia } from "./avisoPrevioUtils";
import { calcularDecimoTerceiro } from "./decimoTerceiroUtils";
import { calcularFerias, calcularTercoConstitucional } from "./feriasUtils";
import { calcularFGTS, calcularMultaFGTS } from "./fgtsUtils";
import { ajustarMesesPorDias } from "../verbasRescisoriasUtils";

/**
 * Calculates indemnified vacation when prior notice is not fulfilled
 * @param salarioBase Base salary
 * @param avisoPrevioCumprido Whether prior notice was fulfilled
 * @returns Indemnified vacation value
 */
const calcularFeriasIndenizadas = (salarioBase: number, avisoPrevioCumprido: boolean): number => {
  if (avisoPrevioCumprido) {
    return 0;
  }
  // 1/12 of monthly salary for indemnified vacation
  return salarioBase / 12;
};

/**
 * Calculates indemnified 13th salary when prior notice is not fulfilled
 * @param salarioBase Base salary
 * @param avisoPrevioCumprido Whether prior notice was fulfilled
 * @returns Indemnified 13th salary value
 */
const calcularDecimoTerceiroIndenizado = (salarioBase: number, avisoPrevioCumprido: boolean): number => {
  if (avisoPrevioCumprido) {
    return 0;
  }
  // 1/12 of monthly salary for indemnified 13th salary
  return salarioBase / 12;
};

/**
 * Calculates all rescission values
 * @param dadosContrato Contract data
 * @returns Object with all rescission values and total
 */
export const calcularVerbasRescisorias = (dadosContrato: DadosContrato): RescisionValues => {
  const salarioBase = parseFloat(dadosContrato.salarioBase) || 0;
  const diasTrabalhados = parseInt(dadosContrato.diasTrabalhados) || 0;
  const mesesTrabalhados = parseInt(dadosContrato.mesesTrabalhados) || 0;
  const avisoPrevioCumprido = dadosContrato.aviso_previo_cumprido || false;
  
  // Cálculo individual das verbas
  const saldoSalario = calcularSaldoSalario(salarioBase, diasTrabalhados);
  
  // Passando os meses trabalhados para calcular o aviso prévio proporcional na rescisão indireta
  const avisoPrevia = calcularAvisoPrevia(
    salarioBase, 
    dadosContrato.tipoRescisao, 
    avisoPrevioCumprido,
    mesesTrabalhados
  );
  
  // Calcular férias e 13º indenizados quando aviso prévio não for cumprido
  const feriasIndenizadas = calcularFeriasIndenizadas(salarioBase, avisoPrevioCumprido);
  const decimoTerceiroIndenizado = calcularDecimoTerceiroIndenizado(salarioBase, avisoPrevioCumprido);
  
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
  
  // Cálculo do FGTS e multa com a regra de 15 dias
  // Aplicamos a regra dos 15 dias para mesesTrabalhados
  const fgts = calcularFGTS(salarioBase, mesesTrabalhados, diasTrabalhados);
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
  
  // Cálculo do total (incluindo férias e 13º indenizados quando aplicáveis)
  const total = saldoSalario + avisoPrevia_ajustado + feriasIndenizadas + decimoTerceiroIndenizado + 
                decimoTerceiro + ferias + tercoConstitucional + fgts + multaFgts;
  
  return {
    saldoSalario,
    avisoPrevia: avisoPrevia_ajustado, // Armazena apenas o valor positivo para exibição
    descontoAvisoPrevio, // Novo campo para armazenar o desconto do aviso prévio
    feriasIndenizadas, // Novo campo para férias indenizadas
    decimoTerceiroIndenizado, // Novo campo para 13º indenizado
    decimoTerceiro,
    ferias, // Agora férias proporcionais baseadas no último período aquisitivo
    tercoConstitucional,
    fgts,
    multaFgts,
    total
  };
};
