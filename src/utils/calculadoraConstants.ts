
import { Resultados } from '@/types/calculadora';

// Resultados iniciais vazios
export const resultadosIniciais: Resultados = {
  verbasRescisorias: {
    saldoSalario: 0,
    avisoPrevia: 0,
    descontoAvisoPrevio: 0, // Added new field
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
    honorariosAdvocaticios: 0,
  }
};

// Valor do salário mínimo atual (atualizado em 2024)
export const SALARIO_MINIMO = 1412;

// Constantes para o cálculo do seguro-desemprego
export const VALOR_MAXIMO_SEGURO_DESEMPREGO = 2230.97; // Valor máximo da parcela em 2024
export const FAIXA_1_SEGURO_DESEMPREGO = 2045.73; // Primeira faixa salarial
export const FAIXA_2_SEGURO_DESEMPREGO = 3409.00; // Segunda faixa salarial

// Constantes para o cálculo do salário-família
export const VALOR_SALARIO_FAMILIA = 59.82; // Valor do salário-família por dependente em 2024
export const LIMITE_SALARIO_FAMILIA = 1754.18; // Limite salarial para ter direito ao salário-família
