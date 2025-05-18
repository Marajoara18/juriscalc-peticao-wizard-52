
/**
 * Main utilities module for additional values calculation
 */
import { Adicionais, CustomCalculo } from "@/types/calculadora";
import { calcularInsalubridade, calcularPericulosidade } from './adicionais/adicionalBasicoUtils';
import { calcularMulta467, calcularMulta477 } from './adicionais/multasUtils';
import { 
  calcularAdicionalNoturno, 
  calcularHorasExtras, 
  calcularFeriasVencidas, 
  calcularIndenizacaoDemissao,
  calcularAdicionalTransferencia 
} from './adicionais/jornadaUtils';
import { calcularValeTransporte, calcularValeAlimentacao } from './adicionais/beneficiosUtils';
import { calcularSeguroDesemprego, calcularSalarioFamilia } from './adicionais/beneficiosSociaisUtils';

/**
 * Calculates all additional values based on contract and additional data
 */
export const calcularAdicionais = (
  salarioBase: number,
  adicionais: Adicionais,
  saldoSalario: number,
  avisoPrevia: number,
  decimoTerceiro: number,
  ferias: number,
  tercoConstitucional: number
) => {
  // Cálculo de insalubridade e periculosidade
  let adicionalInsalubridade = calcularInsalubridade(
    adicionais.calcularInsalubridade,
    adicionais.grauInsalubridade,
    adicionais.baseCalculoInsalubridade,
    salarioBase
  );
  
  let adicionalPericulosidade = calcularPericulosidade(
    adicionais.calcularPericulosidade,
    adicionais.baseCalculoPericulosidade,
    adicionais.percentualPericulosidade,
    salarioBase
  );

  // Decisão entre insalubridade e periculosidade (não pode acumular)
  if (adicionais.calcularInsalubridade && adicionais.calcularPericulosidade) {
    if (adicionalPericulosidade > adicionalInsalubridade) {
      adicionalInsalubridade = 0;
    } else {
      adicionalPericulosidade = 0;
    }
  }

  // Cálculo das multas
  const multa467 = calcularMulta467(
    adicionais.calcularMulta467,
    saldoSalario,
    avisoPrevia,
    decimoTerceiro,
    ferias,
    tercoConstitucional
  );
  
  const multa477 = calcularMulta477(adicionais.calcularMulta477, salarioBase);

  // Cálculo de adicionais noturnos e horas extras
  const adicionalNoturno = calcularAdicionalNoturno(
    adicionais.calcularAdicionalNoturno,
    adicionais.percentualAdicionalNoturno,
    adicionais.horasNoturnas,
    salarioBase
  );
  
  const horasExtras = calcularHorasExtras(
    adicionais.calcularHorasExtras,
    adicionais.percentualHorasExtras,
    adicionais.quantidadeHorasExtras,
    salarioBase
  );

  // Cálculo de férias vencidas e indenização
  const feriasVencidas = calcularFeriasVencidas(
    adicionais.calcularFeriasVencidas,
    adicionais.periodosFeriasVencidas,
    salarioBase
  );
  
  const indenizacaoDemissao = calcularIndenizacaoDemissao(
    adicionais.calcularIndenizacaoDemissao,
    adicionais.valorIndenizacaoDemissao,
    salarioBase
  );

  // Cálculo dos vales
  const valeTransporte = calcularValeTransporte(
    adicionais.calcularValeTransporte,
    adicionais.valorDiarioVT,
    adicionais.diasValeTransporte
  );
  
  const valeAlimentacao = calcularValeAlimentacao(
    adicionais.calcularValeAlimentacao,
    adicionais.valorDiarioVA,
    adicionais.diasValeAlimentacao
  );

  // Outros cálculos
  const adicionalTransferencia = calcularAdicionalTransferencia(
    adicionais.calcularAdicionalTransferencia,
    adicionais.percentualAdicionalTransferencia,
    salarioBase
  );
  
  const descontosIndevidos = adicionais.calcularDescontosIndevidos ? 
    parseFloat(adicionais.valorDescontosIndevidos) || 0 : 0;
    
  const diferencasSalariais = adicionais.calcularDiferencasSalariais ? 
    parseFloat(adicionais.valorDiferencasSalariais) || 0 : 0;
    
  // Cálculo dos valores personalizados
  let customCalculo = 0;
  if (adicionais.calcularCustom) {
    // Se temos múltiplos cálculos personalizados
    if (adicionais.calculosCustom && adicionais.calculosCustom.length > 0) {
      customCalculo = adicionais.calculosCustom.reduce((total, calc) => {
        return total + (parseFloat(calc.valor) || 0);
      }, 0);
    } else {
      // Compatibilidade com o sistema antigo
      customCalculo = parseFloat(adicionais.valorCustom) || 0;
    }
  }

  // Cálculo do seguro desemprego e salário família
  const seguroDesemprego = calcularSeguroDesemprego(
    adicionais.calcularSeguroDesemprego,
    adicionais.calcularSeguroDesemprego ? 'sem_justa_causa' : '',
    parseFloat(adicionais.ultimoSalario || '0') || 0,
    parseInt(adicionais.mesesTrabalhadosUltimoEmprego) || 0,
    parseFloat(adicionais.tempoContribuicaoINSS) || 0
  );
  
  const salarioFamilia = calcularSalarioFamilia(
    adicionais.calcularSalarioFamilia,
    salarioBase,
    parseInt(adicionais.quantidadeFilhos || '0')
  );

  return {
    adicionalInsalubridade,
    adicionalPericulosidade,
    multa467,
    multa477,
    adicionalNoturno,
    horasExtras,
    feriasVencidas,
    indenizacaoDemissao,
    valeTransporte,
    valeAlimentacao,
    adicionalTransferencia,
    descontosIndevidos,
    diferencasSalariais,
    customCalculo,
    seguroDesemprego,
    salarioFamilia,
  };
};

// Re-export all utility functions for external use
export {
  calcularInsalubridade,
  calcularPericulosidade,
  calcularMulta467,
  calcularMulta477,
  calcularAdicionalNoturno,
  calcularHorasExtras,
  calcularFeriasVencidas,
  calcularIndenizacaoDemissao,
  calcularValeTransporte,
  calcularValeAlimentacao,
  calcularAdicionalTransferencia,
  calcularSeguroDesemprego,
  calcularSalarioFamilia
};
