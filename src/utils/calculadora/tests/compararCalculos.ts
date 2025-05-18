
/**
 * Utility to compare calculation results across refactored functions
 */
import { Adicionais } from '@/types/calculadora';
import { 
  calcularInsalubridade, 
  calcularPericulosidade 
} from '@/utils/calculadora/adicionais/adicionalBasicoUtils';
import {
  calcularMulta467,
  calcularMulta477
} from '@/utils/calculadora/adicionais/multasUtils';
import {
  calcularValeTransporte,
  calcularValeAlimentacao
} from '@/utils/calculadora/adicionais/beneficiosUtils';
import {
  calcularAdicionalNoturno,
  calcularHorasExtras
} from '@/utils/calculadora/adicionais/jornadaUtils';
import {
  calcularSeguroDesemprego,
  calcularSalarioFamilia
} from '@/utils/calculadora/adicionais/beneficiosSociaisUtils';

/**
 * Executes specific calculations to verify consistency between original and refactored functions
 * @param adicionais Additional values for test calculations
 * @returns Results of comparison tests
 */
export const executarTestesComparacao = (adicionais: Adicionais, salarioBase: number) => {
  const resultados: Record<string, { valor: number, validacao: string }> = {};

  // Teste dos cálculos de insalubridade e periculosidade
  try {
    const insalubridade = calcularInsalubridade(
      adicionais.calcularInsalubridade,
      adicionais.grauInsalubridade,
      adicionais.baseCalculoInsalubridade,
      salarioBase
    );
    
    resultados.insalubridade = { 
      valor: insalubridade, 
      validacao: insalubridade >= 0 ? 'válido' : 'inválido' 
    };
  } catch (error) {
    resultados.insalubridade = { 
      valor: 0, 
      validacao: `erro: ${(error as Error).message}` 
    };
  }

  // Teste dos cálculos das multas
  try {
    const multa467 = calcularMulta467(
      adicionais.calcularMulta467,
      100,  // saldoSalario
      200,  // avisoPrevia
      300,  // decimoTerceiro
      400,  // ferias
      100   // tercoConstitucional
    );
    
    resultados.multa467 = { 
      valor: multa467, 
      validacao: multa467 >= 0 ? 'válido' : 'inválido' 
    };
  } catch (error) {
    resultados.multa467 = { 
      valor: 0, 
      validacao: `erro: ${(error as Error).message}` 
    };
  }

  // Teste dos cálculos de benefícios
  try {
    const valeTransporte = calcularValeTransporte(
      adicionais.calcularValeTransporte,
      adicionais.valorDiarioVT,
      adicionais.diasValeTransporte
    );
    
    resultados.valeTransporte = { 
      valor: valeTransporte, 
      validacao: valeTransporte >= 0 ? 'válido' : 'inválido' 
    };
  } catch (error) {
    resultados.valeTransporte = { 
      valor: 0, 
      validacao: `erro: ${(error as Error).message}` 
    };
  }

  // Registrar todos os resultados de testes
  console.log('Resultados dos testes de comparação:', resultados);
  
  // Verifica se todos os testes foram bem-sucedidos
  const todosValidos = Object.values(resultados).every(
    r => r.validacao === 'válido'
  );
  
  return {
    success: todosValidos,
    message: todosValidos ? 
      'Todos os testes de comparação foram bem-sucedidos' : 
      'Alguns testes de comparação falharam',
    resultados
  };
};
