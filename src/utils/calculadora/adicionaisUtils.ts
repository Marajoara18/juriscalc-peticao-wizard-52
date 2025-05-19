
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
import { ajustarMesesPorDias } from './verbasRescisoriasUtils';

/**
 * Calcular honorários advocatícios com base no valor definido diretamente
 * Caso não tenha valor definido, calcula com base no percentual
 */
export const calcularHonorariosAdvocaticios = (
  calcular: boolean,
  percentual: string,
  valorDefinido: string,
  totalRescisorias: number,
  totalAdicionais: number
): number => {
  if (!calcular) return 0;
  
  // Verificar se já temos um valor definido
  const valorExistente = parseFloat(valorDefinido);
  if (valorDefinido && !isNaN(valorExistente)) {
    return valorExistente;
  }
  
  // Caso contrário, calcular baseado no percentual
  const percentualHonorarios = parseFloat(percentual) || 20;
  const baseCalculo = totalRescisorias + totalAdicionais;
  
  return (baseCalculo * percentualHonorarios) / 100;
};

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
  // Obter dias trabalhados no mês para aplicar regra dos 15 dias
  const diasTrabalhados = parseInt(adicionais.diasValeTransporte) || 0;
  
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

  // Cálculo de férias vencidas com a regra dos 15 dias
  const feriasVencidas = calcularFeriasVencidas(
    adicionais.calcularFeriasVencidas,
    adicionais.periodosFeriasVencidas,
    salarioBase,
    diasTrabalhados
  );
  
  const indenizacaoDemissao = calcularIndenizacaoDemissao(
    adicionais.calcularIndenizacaoDemissao,
    adicionais.valorIndenizacaoDemissao,
    salarioBase
  );

  // Cálculo dos vales com a regra dos 15 dias
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

  // Cálculo do adicional de transferência com a regra dos 15 dias
  const adicionalTransferencia = calcularAdicionalTransferencia(
    adicionais.calcularAdicionalTransferencia,
    adicionais.percentualAdicionalTransferencia,
    salarioBase,
    diasTrabalhados
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

  // Aplicar a regra dos 15 dias nos benefícios sociais
  // Obter meses trabalhados para seguro desemprego
  let mesesTrabalhadosUltimoEmprego = parseInt(adicionais.mesesTrabalhadosUltimoEmprego) || 0;
  if (diasTrabalhados > 15) {
    mesesTrabalhadosUltimoEmprego = Math.ceil(mesesTrabalhadosUltimoEmprego);
  }
  
  // Cálculo do seguro desemprego e salário família
  const seguroDesemprego = calcularSeguroDesemprego(
    adicionais.calcularSeguroDesemprego,
    adicionais.calcularSeguroDesemprego ? 'sem_justa_causa' : '',
    parseFloat(adicionais.ultimoSalario || '0') || 0,
    mesesTrabalhadosUltimoEmprego,
    parseFloat(adicionais.tempoContribuicaoINSS) || 0
  );
  
  const salarioFamilia = calcularSalarioFamilia(
    adicionais.calcularSalarioFamilia,
    salarioBase,
    parseInt(adicionais.quantidadeFilhos || '0')
  );

  // Calcular o total dos adicionais antes de calcular os honorários
  const totalAdicionais = 
    adicionalInsalubridade +
    adicionalPericulosidade +
    multa467 +
    multa477 +
    adicionalNoturno +
    horasExtras +
    feriasVencidas +
    indenizacaoDemissao +
    valeTransporte +
    valeAlimentacao +
    adicionalTransferencia +
    descontosIndevidos +
    diferencasSalariais +
    customCalculo +
    seguroDesemprego +
    salarioFamilia;
  
  // Total das verbas rescisórias (estimativa para base de cálculo)
  const totalRescisorias = saldoSalario + avisoPrevia + decimoTerceiro + ferias + tercoConstitucional;
  
  // Cálculo dos honorários advocatícios (agora usando também o valorHonorariosAdvocaticios)
  const honorariosAdvocaticios = calcularHonorariosAdvocaticios(
    adicionais.calcularHonorariosAdvocaticios,
    adicionais.percentualHonorariosAdvocaticios,
    adicionais.valorHonorariosAdvocaticios,
    totalRescisorias,
    totalAdicionais
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
    honorariosAdvocaticios
  };
};

// Re-export utility functions for external use
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
