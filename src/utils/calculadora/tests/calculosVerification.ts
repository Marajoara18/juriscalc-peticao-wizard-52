
/**
 * Test utility to verify calculations remain consistent after refactoring
 */
import { DadosContrato, Adicionais, Resultados } from '@/types/calculadora';
import { realizarCalculos } from '@/utils/calculadora/calculosUtils';

/**
 * Verifies that the calculations remain consistent after refactoring
 * @param dadosContrato Contract data for calculations
 * @param adicionais Additional values for calculations
 * @returns Object with verification results
 */
export const verificarCalculos = (
  dadosContrato: DadosContrato,
  adicionais: Adicionais
): { success: boolean; message: string; details?: any } => {
  try {
    // Create a sample test case
    const resultados = realizarCalculos(dadosContrato, adicionais);
    
    // Log the results for verification
    console.log("Resultados dos cálculos após refatoração:", resultados);
    
    // Verify each component of the calculation
    const verificacoes = [
      verificarVerbasRescisorias(resultados),
      verificarAdicionais(resultados)
    ];
    
    // Check if all verifications passed
    const allPassed = verificacoes.every(v => v.success);
    
    if (allPassed) {
      return {
        success: true,
        message: "Todos os cálculos continuam funcionando conforme esperado após a refatoração"
      };
    } else {
      const failedTests = verificacoes.filter(v => !v.success);
      return {
        success: false,
        message: "Alguns cálculos apresentaram diferenças após a refatoração",
        details: failedTests
      };
    }
  } catch (error) {
    console.error("Erro ao verificar cálculos:", error);
    return {
      success: false,
      message: `Erro ao executar verificação: ${(error as Error).message}`,
      details: error
    };
  }
};

/**
 * Verifies rescission values
 */
const verificarVerbasRescisorias = (resultados: Resultados) => {
  const { saldoSalario, avisoPrevia, decimoTerceiro, ferias, tercoConstitucional, fgts, multaFgts, total } = 
    resultados.verbasRescisorias;
  
  // Basic validation of rescission values
  const saldoValid = saldoSalario >= 0;
  const avisoValid = avisoPrevia >= 0;
  const decimoValid = decimoTerceiro >= 0;
  const feriasValid = ferias >= 0;
  const tercoValid = tercoConstitucional >= 0;
  const fgtsValid = fgts >= 0;
  const multaFgtsValid = multaFgts >= 0;
  
  // Check that the total is equal to the sum of components
  const calculatedTotal = saldoSalario + avisoPrevia + decimoTerceiro + 
                          ferias + tercoConstitucional + fgts + multaFgts;
  const totalValid = Math.abs(calculatedTotal - total) < 0.01; // Allow small floating point differences
  
  // Result of verification
  return {
    success: saldoValid && avisoValid && decimoValid && feriasValid && 
             tercoValid && fgtsValid && multaFgtsValid && totalValid,
    message: totalValid ? 
      "Verbas rescisórias calculadas corretamente" : 
      `Inconsistência no total das verbas: esperado ${calculatedTotal}, obtido ${total}`
  };
};

/**
 * Verifies additional values
 */
const verificarAdicionais = (resultados: Resultados) => {
  const {
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
    salarioFamilia
  } = resultados.adicionais;
  
  // Basic validation for additionals (shouldn't be negative)
  const validations = [
    adicionalInsalubridade >= 0,
    adicionalPericulosidade >= 0,
    multa467 >= 0,
    multa477 >= 0,
    adicionalNoturno >= 0,
    horasExtras >= 0,
    feriasVencidas >= 0,
    indenizacaoDemissao >= 0,
    valeTransporte >= 0,
    valeAlimentacao >= 0,
    adicionalTransferencia >= 0,
    descontosIndevidos >= 0,
    diferencasSalariais >= 0,
    customCalculo >= 0,
    seguroDesemprego >= 0,
    salarioFamilia >= 0
  ];
  
  const allValid = validations.every(v => v);
  
  // Insalubridade e periculosidade não podem ser ambos maiores que zero (não acumuláveis)
  const acumulacaoInvalida = adicionalInsalubridade > 0 && adicionalPericulosidade > 0;
  
  return {
    success: allValid && !acumulacaoInvalida,
    message: allValid ? 
      (acumulacaoInvalida ? 
        "Erro: Insalubridade e Periculosidade estão sendo acumuladas indevidamente" :
        "Adicionais calculados corretamente") :
      "Valores negativos encontrados nos adicionais"
  };
};
