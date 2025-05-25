
/**
 * Main calculator for rescission values
 */
import { DadosContrato, RescisionValues } from "@/types/calculadora";
import { calcularSaldoSalario } from "./saldoSalarioUtils";
import { calcularAvisoPrevia } from "./avisoPrevioUtils";
import { calcularDecimoTerceiro } from "./decimoTerceiroUtils";
import { calcularFerias, calcularTercoConstitucional } from "./feriasUtils";
import { calcularFGTS, calcularMultaFGTS } from "./fgtsUtils";

/**
 * Calculates all rescission values with separate notice period values
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
  
  const avisoPrevia = calcularAvisoPrevia(
    salarioBase, 
    dadosContrato.tipoRescisao, 
    avisoPrevioCumprido,
    mesesTrabalhados
  );
  
  // Cálculo dos valores proporcionais ao aviso prévio (quando não cumprido)
  let feriasAvisoPrevia = 0;
  let decimoTerceiroAvisoPrevia = 0;
  
  if (!avisoPrevioCumprido && (dadosContrato.tipoRescisao === 'sem_justa_causa' || dadosContrato.tipoRescisao === 'rescisao_indireta')) {
    // Férias indenizadas sobre o aviso prévio: (Salário/30) × 30 × (1/3) = Salário + (Salário/3)
    feriasAvisoPrevia = salarioBase + (salarioBase / 3);
    // 13º proporcional ao aviso prévio (1/12 do salário)
    decimoTerceiroAvisoPrevia = salarioBase / 12;
  }
  
  // Cálculo dos valores proporcionais gerais (baseados no tempo trabalhado)
  const decimoTerceiro = calcularDecimoTerceiro(
    salarioBase, 
    dadosContrato.dataAdmissao, 
    dadosContrato.dataDemissao, 
    dadosContrato.tipoRescisao
  );
  
  const ferias = calcularFerias(
    salarioBase, 
    dadosContrato.dataAdmissao, 
    dadosContrato.dataDemissao, 
    dadosContrato.tipoRescisao
  );
  
  const tercoConstitucional = calcularTercoConstitucional(ferias + feriasAvisoPrevia);
  
  // Cálculo do FGTS e multa
  const fgts = calcularFGTS(salarioBase, mesesTrabalhados, diasTrabalhados);
  const multaFgts = calcularMultaFGTS(fgts, dadosContrato.tipoRescisao);
  
  // Tratamento do aviso prévio para pedido de demissão
  let avisoPrevia_ajustado = avisoPrevia;
  let descontoAvisoPrevio = 0;
  
  if (dadosContrato.tipoRescisao === 'pedido_demissao' && !avisoPrevioCumprido) {
    avisoPrevia_ajustado = 0;
    descontoAvisoPrevio = Math.abs(avisoPrevia);
    // No pedido de demissão não há valores proporcionais ao aviso prévio
    feriasAvisoPrevia = 0;
    decimoTerceiroAvisoPrevia = 0;
  }
  
  // Cálculo do total
  const total = saldoSalario + avisoPrevia_ajustado + feriasAvisoPrevia + decimoTerceiroAvisoPrevia + 
                decimoTerceiro + ferias + tercoConstitucional + fgts + multaFgts;
  
  return {
    saldoSalario,
    avisoPrevia: avisoPrevia_ajustado,
    descontoAvisoPrevio,
    feriasAvisoPrevia,
    decimoTerceiroAvisoPrevia,
    decimoTerceiro,
    ferias,
    tercoConstitucional,
    fgts,
    multaFgts,
    total
  };
};
