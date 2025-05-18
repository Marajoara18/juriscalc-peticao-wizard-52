
import { DadosContrato, Adicionais, Resultados } from '@/types/calculadora';
import { toast } from "@/components/ui/use-toast";
import { SALARIO_MINIMO, VALOR_MAXIMO_SEGURO_DESEMPREGO, FAIXA_1_SEGURO_DESEMPREGO, FAIXA_2_SEGURO_DESEMPREGO } from '@/utils/calculadoraConstants';

// Constantes para o cálculo do Salário-Família (valores atualizados para 2024)
const VALOR_SALARIO_FAMILIA = 59.82; // Valor por filho em 2024
const LIMITE_SALARIO_FAMILIA = 1754.18; // Limite salarial para ter direito ao benefício em 2024

export const useCalculos = (
  dadosContrato: DadosContrato,
  adicionais: Adicionais,
  setResultados: React.Dispatch<React.SetStateAction<Resultados>>
) => {
  // Função para calcular os resultados
  const calcularResultados = () => {
    // Validações básicas
    if (!dadosContrato.dataAdmissao || !dadosContrato.dataDemissao) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, informe as datas de admissão e demissão.",
        variant: "destructive"
      });
      return;
    }

    if (!dadosContrato.salarioBase || parseFloat(dadosContrato.salarioBase) <= 0) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, informe um salário base válido.",
        variant: "destructive"
      });
      return;
    }

    try {
      const salarioBase = parseFloat(dadosContrato.salarioBase) || 0;
      const diasTrabalhados = parseInt(dadosContrato.diasTrabalhados) || 0;
      const mesesTrabalhados = parseInt(dadosContrato.mesesTrabalhados) || 0;
      
      console.log("Calculando com:", { salarioBase, diasTrabalhados, mesesTrabalhados });

      // Cálculo das verbas rescisórias
      const saldoSalario = (salarioBase / 30) * diasTrabalhados;
      const avisoPrevia = (dadosContrato.tipoRescisao === 'sem_justa_causa' || dadosContrato.tipoRescisao === 'rescisao_indireta') 
        ? salarioBase
        : 0;
      const decimoTerceiro = (salarioBase / 12) * mesesTrabalhados;
      const ferias = (salarioBase / 12) * mesesTrabalhados;
      const tercoConstitucional = ferias / 3;
      const baseCalculoFgts = saldoSalario + avisoPrevia + decimoTerceiro;
      const fgts = baseCalculoFgts * 0.08;
      const multaFgts = (dadosContrato.tipoRescisao === 'sem_justa_causa' || dadosContrato.tipoRescisao === 'rescisao_indireta') 
        ? fgts * 0.4
        : 0;
      const totalVerbaRescisoria = saldoSalario + avisoPrevia + decimoTerceiro + ferias + tercoConstitucional + fgts + multaFgts;

      // Cálculo dos adicionais
      const calculosAdicionais = calcularAdicionais(salarioBase, adicionais, saldoSalario, avisoPrevia, decimoTerceiro, ferias, tercoConstitucional);

      // Atualiza o estado com os resultados calculados
      setResultados({
        verbasRescisorias: {
          saldoSalario,
          avisoPrevia,
          decimoTerceiro,
          ferias,
          tercoConstitucional,
          fgts,
          multaFgts,
          total: totalVerbaRescisoria,
        },
        adicionais: calculosAdicionais
      });

      // Notifica o usuário que os cálculos foram realizados com sucesso
      toast({
        title: "Cálculos realizados",
        description: "Os valores foram calculados com sucesso.",
      });

      // Expande automaticamente os acordeões de resultado
      document.querySelectorAll('[data-state="closed"]').forEach((accordion) => {
        const button = accordion.querySelector('button');
        if (button) button.click();
      });
      
      console.log("Cálculos realizados:", { 
        verbasRescisorias: {
          saldoSalario,
          avisoPrevia,
          decimoTerceiro,
          ferias,
          tercoConstitucional,
          fgts,
          multaFgts,
          total: totalVerbaRescisoria,
        },
        adicionais: calculosAdicionais
      });
    } catch (error) {
      console.error("Erro ao calcular resultados:", error);
      toast({
        title: "Erro ao calcular",
        description: "Ocorreu um erro nos cálculos. Verifique os dados informados.",
        variant: "destructive"
      });
    }
  };

  // Função auxiliar para calcular os adicionais
  const calcularAdicionais = (
    salarioBase: number,
    adicionais: Adicionais,
    saldoSalario: number,
    avisoPrevia: number,
    decimoTerceiro: number,
    ferias: number,
    tercoConstitucional: number
  ) => {
    let adicionalInsalubridade = 0;
    let adicionalPericulosidade = 0;
    let multa467 = 0;
    let multa477 = 0;
    let adicionalNoturno = 0;
    let horasExtras = 0;
    let feriasVencidas = 0;
    let indenizacaoDemissao = 0;
    let valeTransporte = 0;
    let valeAlimentacao = 0;
    let adicionalTransferencia = 0;
    let descontosIndevidos = 0;
    let diferencasSalariais = 0;
    let customCalculo = 0;
    let seguroDesemprego = 0;
    let salarioFamilia = 0;

    // Cálculo de insalubridade
    if (adicionais.calcularInsalubridade) {
      const baseCalculo = adicionais.baseCalculoInsalubridade === 'salario_minimo' ? SALARIO_MINIMO : salarioBase;
      let percentualInsalubridade = 0.1; // Padrão: mínimo (10%)
      
      if (adicionais.grauInsalubridade === 'medio') {
        percentualInsalubridade = 0.2; // Médio (20%)
      } else if (adicionais.grauInsalubridade === 'maximo') {
        percentualInsalubridade = 0.4; // Máximo (40%)
      }
      
      adicionalInsalubridade = baseCalculo * percentualInsalubridade;
    }

    // Cálculo de periculosidade
    if (adicionais.calcularPericulosidade) {
      const baseCalculo = adicionais.baseCalculoPericulosidade === 'salario_base' ? salarioBase : SALARIO_MINIMO;
      const percentual = parseInt(adicionais.percentualPericulosidade) / 100;
      adicionalPericulosidade = baseCalculo * percentual;
    }

    // Decisão entre insalubridade e periculosidade (não pode acumular)
    if (adicionais.calcularInsalubridade && adicionais.calcularPericulosidade) {
      if (adicionalPericulosidade > adicionalInsalubridade) {
        adicionalInsalubridade = 0;
      } else {
        adicionalPericulosidade = 0;
      }
    }

    // Multa do Art. 467 CLT
    if (adicionais.calcularMulta467) {
      multa467 = (saldoSalario + avisoPrevia + decimoTerceiro + ferias + tercoConstitucional) * 0.5;
    }

    // Multa do Art. 477 CLT
    if (adicionais.calcularMulta477) {
      multa477 = salarioBase;
    }

    // Adicional noturno
    if (adicionais.calcularAdicionalNoturno) {
      const valorHoraNormal = salarioBase / 220; // Considera jornada de 220h mensais
      const percentual = parseInt(adicionais.percentualAdicionalNoturno) / 100;
      const horasNoturnas = parseInt(adicionais.horasNoturnas) || 0;
      adicionalNoturno = valorHoraNormal * percentual * horasNoturnas;
    }

    // Horas extras
    if (adicionais.calcularHorasExtras) {
      const valorHoraNormal = salarioBase / 220; // Considera jornada de 220h mensais
      const percentual = parseInt(adicionais.percentualHorasExtras) / 100;
      const quantidadeHorasExtras = parseInt(adicionais.quantidadeHorasExtras) || 0;
      horasExtras = valorHoraNormal * (1 + percentual) * quantidadeHorasExtras;
    }

    // Férias Vencidas
    if (adicionais.calcularFeriasVencidas) {
      const periodosFeriasVencidas = parseInt(adicionais.periodosFeriasVencidas) || 1;
      feriasVencidas = salarioBase * periodosFeriasVencidas + (salarioBase * periodosFeriasVencidas / 3); // Férias + 1/3
    }

    // Indenização por demissão sem justa causa
    if (adicionais.calcularIndenizacaoDemissao) {
      indenizacaoDemissao = parseFloat(adicionais.valorIndenizacaoDemissao) || salarioBase; // Usa valor informado ou salário base
    }

    // Vale Transporte não pago
    if (adicionais.calcularValeTransporte) {
      const valorDiarioVT = parseFloat(adicionais.valorDiarioVT) || 0;
      const diasVT = parseInt(adicionais.diasValeTransporte) || 22; // Padrão: 22 dias úteis
      valeTransporte = valorDiarioVT * diasVT;
    }

    // Vale Alimentação não pago
    if (adicionais.calcularValeAlimentacao) {
      const valorDiarioVA = parseFloat(adicionais.valorDiarioVA) || 0;
      const diasVA = parseInt(adicionais.diasValeAlimentacao) || 22; // Padrão: 22 dias úteis
      valeAlimentacao = valorDiarioVA * diasVA;
    }

    // Adicional de Transferência
    if (adicionais.calcularAdicionalTransferencia) {
      const percentualTransferencia = parseInt(adicionais.percentualAdicionalTransferencia) / 100;
      adicionalTransferencia = salarioBase * percentualTransferencia;
    }

    // Descontos Indevidos
    if (adicionais.calcularDescontosIndevidos) {
      descontosIndevidos = parseFloat(adicionais.valorDescontosIndevidos) || 0;
    }

    // Diferenças Salariais
    if (adicionais.calcularDiferencasSalariais) {
      diferencasSalariais = parseFloat(adicionais.valorDiferencasSalariais) || 0;
    }

    // Cálculo Personalizado
    if (adicionais.calcularCustom) {
      customCalculo = parseFloat(adicionais.valorCustom) || 0;
    }

    // Seguro Desemprego
    if (adicionais.calcularSeguroDesemprego) {
      seguroDesemprego = calcularSeguroDesemprego(
        dadosContrato.tipoRescisao,
        parseFloat(adicionais.ultimoSalario || dadosContrato.salarioBase) || 0,
        parseInt(adicionais.mesesTrabalhadosUltimoEmprego) || 0,
        parseFloat(adicionais.tempoContribuicaoINSS) || 0
      );
    }
    
    // Salário Família
    if (adicionais.calcularSalarioFamilia) {
      salarioFamilia = calcularSalarioFamilia(
        salarioBase,
        parseInt(adicionais.quantidadeFilhos || '0')
      );
    }

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

  // Função auxiliar para calcular o seguro-desemprego
  const calcularSeguroDesemprego = (
    tipoRescisao: string, 
    ultimoSalario: number, 
    mesesTrabalhadosUltimoEmprego: number, 
    tempoContribuicaoINSS: number
  ) => {
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
  
  // Função auxiliar para calcular o salário-família
  const calcularSalarioFamilia = (
    salarioBase: number,
    quantidadeFilhos: number
  ) => {
    // Verifica se tem direito ao benefício (salário abaixo do limite)
    if (salarioBase > LIMITE_SALARIO_FAMILIA || quantidadeFilhos <= 0) {
      return 0;
    }
    
    // Cálculo do valor do salário-família
    return VALOR_SALARIO_FAMILIA * quantidadeFilhos;
  };

  return { calcularResultados };
};
