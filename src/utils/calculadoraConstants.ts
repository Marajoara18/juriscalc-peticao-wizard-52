
import { Resultados } from '@/types/calculadora';

// Valores iniciais para os resultados dos cálculos
export const resultadosIniciais: Resultados = {
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
    seguroDesemprego: 0,
    salarioFamilia: 0,
  },
};

// Constantes para cálculos gerais
export const SALARIO_MINIMO = 1412; // Valor do salário mínimo 2024
export const VALOR_MAXIMO_SEGURO_DESEMPREGO = 2230.97; // Valor máximo em 2024
export const FAIXA_1_SEGURO_DESEMPREGO = 1968.36;
export const FAIXA_2_SEGURO_DESEMPREGO = 3280.93;

// Constantes para o cálculo do Salário-Família (valores atualizados para 2024)
export const VALOR_SALARIO_FAMILIA = 59.82; // Valor por filho em 2024
export const LIMITE_SALARIO_FAMILIA = 1754.18; // Limite salarial para ter direito ao benefício em 2024
