
import { Resultados } from '@/types/calculadora';

export const resultadosIniciais: Resultados = {
  verbasRescisorias: {
    saldoSalario: 0,
    avisoPrevia: 0,
    descontoAvisoPrevio: 0,
    feriasIndenizadas: 0, // Added new field
    decimoTerceiroIndenizado: 0, // Added new field
    decimoTerceiro: 0,
    ferias: 0,
    tercoConstitucional: 0,
    fgts: 0,
    multaFgts: 0,
    total: 0
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
    honorariosAdvocaticios: 0
  }
};

// Valores de exemplo para salário mínimo (pode ser atualizado conforme necessário)
export const SALARIO_MINIMO = 1320.00; // 2024

// Constantes para cálculos de insalubridade
export const PERCENTUAIS_INSALUBRIDADE = {
  minimo: 10,
  medio: 20,
  maximo: 40
};

// Constantes para cálculos de FGTS
export const PERCENTUAL_FGTS = 8;
export const PERCENTUAL_MULTA_FGTS = 40;

// Dias considerados para um mês completo
export const DIAS_MES = 30;

// Meses do ano
export const MESES_ANO = 12;

// Constantes para seguro-desemprego 2025
export const VALOR_SALARIO_MINIMO_2025 = 1518.00;
export const FAIXA_1_SEGURO_DESEMPREGO = 2138.76;
export const FAIXA_2_SEGURO_DESEMPREGO = 3564.96;
export const VALOR_MAXIMO_SEGURO_DESEMPREGO = 2313.74;
export const VALOR_ADICIONAL_FAIXA_2 = 1711.01;

// Constantes para salário-família
export const VALOR_SALARIO_FAMILIA = 62.04;
export const LIMITE_SALARIO_FAMILIA = 1819.26;
