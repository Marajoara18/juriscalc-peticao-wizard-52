
import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { calcularMesesEntreDatas, calcularDiasEntreDatas } from '@/utils/formatters';
import { DadosContrato, Adicionais, Resultados } from '@/types/calculadora';

const resultadosIniciais: Resultados = {
  verbasRescisorias: {
    saldoSalario: 0,
    avisoPrevia: 0,
    decimoTerceiro: 0,
    ferias: 0,
    tercoConstitucional: 0,
    fgts: 0,
    multaFgts: 0,
    total: 0,
  },
  adicionais: {
    adicionalInsalubridade: 0,
    adicionalPericulosidade: 0,
    multa467: 0,
    multa477: 0,
    adicionalNoturno: 0,
    horasExtras: 0,
    feriasVencidas: 0,
    indenizacaoDemissao: 0,
    valeTransporte: 0,
    valeAlimentacao: 0,
    adicionalTransferencia: 0,
    descontosIndevidos: 0,
    diferencasSalariais: 0,
    customCalculo: 0,
  }
};

export const useCalculadora = () => {
  // Estado para os inputs
  const [dadosContrato, setDadosContrato] = useState<DadosContrato>({
    dataAdmissao: '',
    dataDemissao: '',
    salarioBase: '',
    tipoRescisao: 'sem_justa_causa',
    diasTrabalhados: '',
    mesesTrabalhados: '',
  });

  // Estado para calcular adicionais
  const [adicionais, setAdicionais] = useState<Adicionais>({
    calcularInsalubridade: false,
    grauInsalubridade: 'minimo',
    baseCalculoInsalubridade: 'salario_minimo',
    calcularPericulosidade: false,
    percentualPericulosidade: '30',
    baseCalculoPericulosidade: 'salario_base',
    calcularMulta467: false,
    calcularMulta477: false,
    calcularAdicionalNoturno: false,
    percentualAdicionalNoturno: '20',
    horasNoturnas: '',
    calcularHorasExtras: false,
    quantidadeHorasExtras: '',
    percentualHorasExtras: '50',
    calcularFeriasVencidas: false,
    periodosFeriasVencidas: '1',
    calcularIndenizacaoDemissao: false,
    valorIndenizacaoDemissao: '',
    calcularValeTransporte: false,
    valorDiarioVT: '',
    diasValeTransporte: '',
    calcularValeAlimentacao: false,
    valorDiarioVA: '',
    diasValeAlimentacao: '',
    calcularAdicionalTransferencia: false,
    percentualAdicionalTransferencia: '25',
    calcularDescontosIndevidos: false,
    valorDescontosIndevidos: '',
    calcularDiferencasSalariais: false,
    valorDiferencasSalariais: '',
    calcularCustom: false,
    descricaoCustom: '',
    valorCustom: '',
  });

  // Estado para os resultados
  const [resultados, setResultados] = useState<Resultados>(resultadosIniciais);

  // Efeito para calcular automaticamente dias e meses trabalhados quando as datas são alteradas
  useEffect(() => {
    if (dadosContrato.dataAdmissao && dadosContrato.dataDemissao) {
      try {
        const meses = calcularMesesEntreDatas(dadosContrato.dataAdmissao, dadosContrato.dataDemissao);
        const dias = calcularDiasEntreDatas(
          `${dadosContrato.dataDemissao.slice(0, 7)}-01`, 
          dadosContrato.dataDemissao
        );
        
        setDadosContrato(prev => ({
          ...prev,
          mesesTrabalhados: String(meses),
          diasTrabalhados: String(dias)
        }));
      } catch (error) {
        console.error("Erro ao calcular período:", error);
      }
    }
  }, [dadosContrato.dataAdmissao, dadosContrato.dataDemissao]);

  // Função para atualizar os dados do contrato
  const handleDadosContratoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDadosContrato(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função para atualizar os dados dos adicionais
  const handleAdicionaisChange = (name: string, value: string | boolean) => {
    setAdicionais(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
      const salarioMinimo = 1412; // Valor do salário mínimo 2024
      
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

      // Cálculo dos adicionais existentes
      let adicionalInsalubridade = 0;
      let adicionalPericulosidade = 0;
      let multa467 = 0;
      let multa477 = 0;
      let adicionalNoturno = 0;
      let horasExtras = 0;

      if (adicionais.calcularInsalubridade) {
        const baseCalculo = adicionais.baseCalculoInsalubridade === 'salario_minimo' ? salarioMinimo : salarioBase;
        let percentualInsalubridade = 0.1; // Padrão: mínimo (10%)
        
        if (adicionais.grauInsalubridade === 'medio') {
          percentualInsalubridade = 0.2; // Médio (20%)
        } else if (adicionais.grauInsalubridade === 'maximo') {
          percentualInsalubridade = 0.4; // Máximo (40%)
        }
        
        adicionalInsalubridade = baseCalculo * percentualInsalubridade;
      }

      if (adicionais.calcularPericulosidade) {
        const baseCalculo = adicionais.baseCalculoPericulosidade === 'salario_base' ? salarioBase : salarioMinimo;
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

      if (adicionais.calcularMulta467) {
        multa467 = (saldoSalario + avisoPrevia + decimoTerceiro + ferias + tercoConstitucional) * 0.5;
      }

      if (adicionais.calcularMulta477) {
        multa477 = salarioBase;
      }

      if (adicionais.calcularAdicionalNoturno) {
        const valorHoraNormal = salarioBase / 220; // Considera jornada de 220h mensais
        const percentual = parseInt(adicionais.percentualAdicionalNoturno) / 100;
        const horasNoturnas = parseInt(adicionais.horasNoturnas) || 0;
        adicionalNoturno = valorHoraNormal * percentual * horasNoturnas;
      }

      if (adicionais.calcularHorasExtras) {
        const valorHoraNormal = salarioBase / 220; // Considera jornada de 220h mensais
        const percentual = parseInt(adicionais.percentualHorasExtras) / 100;
        const quantidadeHorasExtras = parseInt(adicionais.quantidadeHorasExtras) || 0;
        horasExtras = valorHoraNormal * (1 + percentual) * quantidadeHorasExtras;
      }

      // Cálculo dos novos adicionais
      let feriasVencidas = 0;
      let indenizacaoDemissao = 0;
      let valeTransporte = 0;
      let valeAlimentacao = 0;
      let adicionalTransferencia = 0;
      let descontosIndevidos = 0;
      let diferencasSalariais = 0;
      let customCalculo = 0;

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
        adicionais: {
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
        }
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
        adicionais: {
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
        }
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

  return {
    dadosContrato,
    adicionais,
    resultados,
    setDadosContrato,
    setAdicionais,
    setResultados,
    handleDadosContratoChange,
    handleAdicionaisChange,
    calcularResultados,
  };
};

export default useCalculadora;
