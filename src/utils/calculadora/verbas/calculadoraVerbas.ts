
/**
 * Main calculator for rescission values
 */
import { DadosContrato, RescisionValues } from "@/types/calculadora";
import { calcularSaldoSalario } from "./saldoSalarioUtils";
import { calcularAvisoPrevia } from "./avisoPrevioUtils";
import { calcularDecimoTerceiro } from "./decimoTerceiroUtils";
import { calcularFerias, calcularTercoConstitucional } from "./feriasUtils";
import { calcularFGTS, calcularMultaFGTS } from "./fgtsUtils";
import { calcularIndenizacaoQuebraContrato } from "./indenizacaoQuebraContratoUtils";

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
  const fgtsDepositado = dadosContrato.fgts_depositado || false;
  const contratoTempoDeterminado = dadosContrato.contrato_tempo_determinado || false;
  const mesesRestantesContrato = parseInt(dadosContrato.meses_restantes_contrato) || 0;
  
  console.log(`Dados do contrato:`, {
    salarioBase,
    diasTrabalhados,
    mesesTrabalhados,
    avisoPrevioCumprido,
    fgtsDepositado,
    contratoTempoDeterminado,
    mesesRestantesContrato
  });
  
  // Cálculo individual das verbas
  const saldoSalario = calcularSaldoSalario(salarioBase, diasTrabalhados);
  
  // Para contrato por tempo determinado, o aviso prévio não se aplica
  let avisoPrevia = 0;
  let feriasAvisoPrevia = 0;
  let decimoTerceiroAvisoPrevia = 0;
  
  if (!contratoTempoDeterminado) {
    avisoPrevia = calcularAvisoPrevia(
      salarioBase, 
      dadosContrato.tipoRescisao, 
      avisoPrevioCumprido,
      mesesTrabalhados
    );
    
    // Cálculo dos valores proporcionais ao aviso prévio (quando não cumprido)
    if (!avisoPrevioCumprido && (dadosContrato.tipoRescisao === 'sem_justa_causa' || dadosContrato.tipoRescisao === 'rescisao_indireta')) {
      // Férias indenizadas sobre o aviso prévio: (Salário/30) × 30 × (1/3) = Salário + (Salário/3)
      feriasAvisoPrevia = salarioBase + (salarioBase / 3);
      // 13º proporcional ao aviso prévio (1/12 do salário)
      decimoTerceiroAvisoPrevia = salarioBase / 12;
    }
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
  
  // Corrigir: 1/3 constitucional deve considerar apenas as férias proporcionais
  const tercoConstitucional = calcularTercoConstitucional(ferias);
  
  // Cálculo do FGTS e multa - só calcular se não foi depositado
  const fgts = fgtsDepositado ? 0 : calcularFGTS(salarioBase, mesesTrabalhados, diasTrabalhados);
  
  // Para contrato por tempo determinado, não há multa de 40% do FGTS
  let multaFgts = 0;
  if (!contratoTempoDeterminado) {
    multaFgts = fgtsDepositado ? 0 : calcularMultaFGTS(fgts, dadosContrato.tipoRescisao);
  }
  
  // Cálculo da indenização por quebra de contrato (só para contrato por tempo determinado)
  const indenizacaoQuebraContrato = contratoTempoDeterminado 
    ? calcularIndenizacaoQuebraContrato(salarioBase, mesesRestantesContrato)
    : 0;
  
  // Tratamento do aviso prévio para pedido de demissão
  let avisoPrevia_ajustado = avisoPrevia;
  let descontoAvisoPrevio = 0;
  
  if (dadosContrato.tipoRescisao === 'pedido_demissao' && !avisoPrevioCumprido && !contratoTempoDeterminado) {
    avisoPrevia_ajustado = 0;
    descontoAvisoPrevio = Math.abs(avisoPrevia);
    // No pedido de demissão não há valores proporcionais ao aviso prévio
    feriasAvisoPrevia = 0;
    decimoTerceiroAvisoPrevia = 0;
  }
  
  // Cálculo do total
  const total = saldoSalario + avisoPrevia_ajustado + feriasAvisoPrevia + decimoTerceiroAvisoPrevia + 
                decimoTerceiro + ferias + tercoConstitucional + fgts + multaFgts + indenizacaoQuebraContrato;
  
  console.log(`Valores calculados:`, {
    saldoSalario,
    avisoPrevia: avisoPrevia_ajustado,
    feriasAvisoPrevia,
    decimoTerceiroAvisoPrevia,
    decimoTerceiro,
    ferias,
    tercoConstitucional,
    fgts,
    multaFgts,
    indenizacaoQuebraContrato,
    total
  });
  
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
    indenizacaoQuebraContrato,
    total
  };
};
