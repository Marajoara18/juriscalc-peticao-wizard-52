
import { Resultados } from '@/types/calculadora';

// Valores monetários atualizados para 2025
export const SALARIO_MINIMO = 1518.00; // Salário mínimo 2025
export const VALOR_SALARIO_MINIMO_2025 = 1518.00;

// Constantes para Seguro Desemprego
export const VALOR_MAXIMO_SEGURO_DESEMPREGO = 2373.28;
export const FAIXA_1_SEGURO_DESEMPREGO = 2138.76;
export const FAIXA_2_SEGURO_DESEMPREGO = 3564.96;
export const VALOR_ADICIONAL_FAIXA_2 = 1711.01;

// Constantes para Salário Família
export const VALOR_SALARIO_FAMILIA = 70.32;
export const LIMITE_SALARIO_FAMILIA = 1819.26;

export const resultadosIniciais: Resultados = {
  verbasRescisorias: {
    saldoSalario: 0,
    avisoPrevia: 0,
    descontoAvisoPrevio: 0,
    feriasAvisoPrevia: 0,
    decimoTerceiroAvisoPrevia: 0,
    decimoTerceiro: 0,
    ferias: 0,
    tercoConstitucional: 0,
    fgts: 0,
    multaFgts: 0,
    indenizacaoQuebraContrato: 0,
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
