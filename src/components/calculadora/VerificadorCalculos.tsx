
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { verificarCalculos } from '@/utils/calculadora/tests/calculosVerification';
import { executarTestesComparacao } from '@/utils/calculadora/tests/compararCalculos';
import { DadosContrato, Adicionais } from '@/types/calculadora';

/**
 * Component for verifying calculations remain consistent after refactoring
 * For development/testing purposes
 */
const VerificadorCalculos: React.FC = () => {
  const [resultado, setResultado] = useState<string | null>(null);
  const [resultadoComparacao, setResultadoComparacao] = useState<string | null>(null);

  // Exemplo de dados para teste
  const dadosContrato: DadosContrato = {
    dataAdmissao: '2022-01-01',
    dataDemissao: '2023-01-01',
    salarioBase: '2000',
    tipoRescisao: 'sem_justa_causa',
    diasTrabalhados: '30',
    mesesTrabalhados: '12',
  };

  const adicionaisBasico: Adicionais = {
    calcularInsalubridade: true,
    grauInsalubridade: 'medio',
    baseCalculoInsalubridade: 'salario_minimo',
    calcularPericulosidade: false,
    percentualPericulosidade: '30',
    baseCalculoPericulosidade: 'salario_base',
    calcularMulta467: true,
    calcularMulta477: true,
    calcularAdicionalNoturno: true,
    percentualAdicionalNoturno: '20',
    horasNoturnas: '40',
    calcularHorasExtras: true,
    quantidadeHorasExtras: '20',
    percentualHorasExtras: '50',
    calcularFeriasVencidas: false,
    periodosFeriasVencidas: '1',
    calcularIndenizacaoDemissao: false,
    valorIndenizacaoDemissao: '',
    calcularValeTransporte: true,
    valorDiarioVT: '10',
    diasValeTransporte: '22',
    calcularValeAlimentacao: true,
    valorDiarioVA: '25',
    diasValeAlimentacao: '22',
    calcularAdicionalTransferencia: false,
    percentualAdicionalTransferencia: '25',
    calcularDescontosIndevidos: false,
    valorDescontosIndevidos: '',
    calcularDiferencasSalariais: false,
    valorDiferencasSalariais: '',
    calcularCustom: false,
    calculosCustom: [],
    descricaoCustom: '',
    valorCustom: '',
    calcularSeguroDesemprego: true,
    ultimoSalario: '2000',
    mesesTrabalhadosUltimoEmprego: '12',
    tempoContribuicaoINSS: '5',
    calcularSalarioFamilia: true,
    quantidadeFilhos: '2',
  };

  // Complexidade adicional para testar
  const adicionaisComplexos: Adicionais = {
    ...adicionaisBasico,
    calcularInsalubridade: false,
    calcularPericulosidade: true,
    calcularFeriasVencidas: true,
    periodosFeriasVencidas: '2',
    calcularIndenizacaoDemissao: true,
    valorIndenizacaoDemissao: '5000',
  };

  const executarVerificacao = () => {
    // Execute verificação com múltiplos casos de teste
    const resultado1 = verificarCalculos(dadosContrato, adicionaisBasico);
    const resultado2 = verificarCalculos(dadosContrato, adicionaisComplexos);
    
    // Prepare results message
    let mensagem = 'Resultados da verificação:';
    mensagem += `\n\nTeste 1 - ${resultado1.success ? '✅ Sucesso' : '❌ Falha'}`;
    mensagem += `\n${resultado1.message}`;
    
    mensagem += `\n\nTeste 2 - ${resultado2.success ? '✅ Sucesso' : '❌ Falha'}`;
    mensagem += `\n${resultado2.message}`;
    
    // Set and display results
    setResultado(mensagem);
    
    if (resultado1.success && resultado2.success) {
      toast.success('Todos os testes de cálculo passaram!');
    } else {
      toast.error('Alguns testes de cálculo falharam!');
    }
    
    // Log detailed results
    console.log('Detalhes da Verificação 1:', resultado1);
    console.log('Detalhes da Verificação 2:', resultado2);
  };

  const executarComparacao = () => {
    const salarioBase = parseFloat(dadosContrato.salarioBase) || 2000;
    
    // Teste com configurações básicas
    const resultadoBasico = executarTestesComparacao(adicionaisBasico, salarioBase);
    
    // Teste com configurações complexas
    const resultadoComplexo = executarTestesComparacao(adicionaisComplexos, salarioBase);
    
    // Prepare results message
    let mensagem = 'Resultados da comparação entre funções:';
    mensagem += `\n\nTeste Básico - ${resultadoBasico.success ? '✅ Sucesso' : '❌ Falha'}`;
    mensagem += `\n${resultadoBasico.message}`;
    
    mensagem += `\n\nTeste Complexo - ${resultadoComplexo.success ? '✅ Sucesso' : '❌ Falha'}`;
    mensagem += `\n${resultadoComplexo.message}`;
    
    // Set and display results
    setResultadoComparacao(mensagem);
    
    if (resultadoBasico.success && resultadoComplexo.success) {
      toast.success('Todos os testes de comparação passaram!');
    } else {
      toast.error('Alguns testes de comparação falharam!');
    }
  };

  return (
    <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
      <h2 className="text-lg font-semibold mb-4">Verificador de Cálculos</h2>
      
      <div className="flex gap-4 mb-4">
        <Button onClick={executarVerificacao} variant="outline">
          Verificar Resultados Finais
        </Button>
        
        <Button onClick={executarComparacao} variant="outline">
          Comparar Funções Individuais
        </Button>
      </div>
      
      {resultado && (
        <div className="mt-4 p-4 bg-white dark:bg-gray-800 border rounded-md">
          <h3 className="text-md font-medium mb-2">Resultado da Verificação:</h3>
          <pre className="text-xs whitespace-pre-wrap">{resultado}</pre>
        </div>
      )}
      
      {resultadoComparacao && (
        <div className="mt-4 p-4 bg-white dark:bg-gray-800 border rounded-md">
          <h3 className="text-md font-medium mb-2">Resultado da Comparação:</h3>
          <pre className="text-xs whitespace-pre-wrap">{resultadoComparacao}</pre>
        </div>
      )}
      
      <div className="mt-4 text-sm text-muted-foreground">
        Esta ferramenta verifica se os cálculos continuam funcionando corretamente após a refatoração.
        Use-a apenas durante o desenvolvimento e teste.
      </div>
    </div>
  );
};

export default VerificadorCalculos;
