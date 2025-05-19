
import { useState } from 'react';
import { INDICES, TipoIndiceCorrecao } from '@/data/indicesCorrecao';
import { toast } from "@/components/ui/use-toast";

export interface CalculoCorrecaoParams {
  valor: number;
  dataInicio: string;
  indiceCorrecao: TipoIndiceCorrecao;
  jurosMora?: number;
}

export const useCalculoCorrecao = () => {
  const [valorCorrigido, setValorCorrigido] = useState<number | null>(null);

  const calcularCorrecaoMonetaria = ({ valor, dataInicio, indiceCorrecao, jurosMora = 0 }: CalculoCorrecaoParams) => {
    if (isNaN(valor) || valor <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor numérico válido.",
        variant: "destructive"
      });
      return null;
    }
    
    if (!dataInicio) {
      toast({
        title: "Data inválida",
        description: "Por favor, insira uma data de início.",
        variant: "destructive"
      });
      return null;
    }
    
    // Verificar formato da data (dd/mm/aaaa)
    const dataRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dataInicio.match(dataRegex);
    
    if (!match) {
      toast({
        title: "Formato de data inválido",
        description: "Por favor, insira uma data no formato dd/mm/aaaa.",
        variant: "destructive"
      });
      return null;
    }
    
    const dia = parseInt(match[1]);
    const mes = parseInt(match[2]);
    const ano = parseInt(match[3]);
    
    // Validar data
    if (dia < 1 || dia > 31 || mes < 1 || mes > 12) {
      toast({
        title: "Data inválida",
        description: "Por favor, insira uma data válida.",
        variant: "destructive"
      });
      return null;
    }
    
    // Buscar os índices de correção
    const indicesDisponiveis = INDICES[indiceCorrecao];
    let fatorAcumulado = 1;
    
    // Calcular número de meses entre a data de início e a data atual
    const dataInicioObj = new Date(ano, mes - 1, dia);
    const dataAtual = new Date();
    
    // Calcular meses decorridos
    const mesesDecorridos = Math.max(1, 
      ((dataAtual.getFullYear() - dataInicioObj.getFullYear()) * 12) + 
      (dataAtual.getMonth() - dataInicioObj.getMonth())
    );
    
    // Aplicamos os índices do período (limitado ao que temos disponível)
    const mesesACorrigir = Math.min(mesesDecorridos, indicesDisponiveis.length);
    
    // Log para debug
    console.log(`Calculando correção monetária:
      - Valor original: ${valor}
      - Data início: ${dataInicio} (${dia}/${mes}/${ano})
      - Índice: ${indiceCorrecao}
      - Meses decorridos: ${mesesDecorridos}
      - Meses a corrigir: ${mesesACorrigir}
      - Juros de mora: ${jurosMora * 100}% ao mês`);
    
    // Aplicar índices de correção monetária
    for (let i = 0; i < mesesACorrigir; i++) {
      const indice = indicesDisponiveis[i].indice / 100;
      fatorAcumulado *= (1 + indice);
      console.log(`  Mês ${i+1}: Índice ${indicesDisponiveis[i].mes} = ${indicesDisponiveis[i].indice}% -> Fator acumulado: ${fatorAcumulado}`);
    }
    
    // Calcular o valor corrigido pela inflação
    let valorCorrigidoInflacao = valor * fatorAcumulado;
    console.log(`Valor corrigido pela inflação: ${valorCorrigidoInflacao}`);
    
    // Aplicar juros de mora se solicitado
    let valorFinalComJuros = valorCorrigidoInflacao;
    
    if (jurosMora > 0) {
      // Aplicar juros compostos mensais
      const fatorJuros = Math.pow(1 + jurosMora, mesesDecorridos);
      valorFinalComJuros = valorCorrigidoInflacao * fatorJuros;
      console.log(`Valor com juros de mora (${jurosMora * 100}% ao mês por ${mesesDecorridos} meses): ${valorFinalComJuros}`);
    }
    
    // Arredondar para 2 casas decimais
    const valorFinal = Math.round(valorFinalComJuros * 100) / 100;
    
    // Atualizar estado
    setValorCorrigido(valorFinal);
    
    // Retornar o resultado para uso imediato
    return valorFinal;
  };
  
  return {
    valorCorrigido,
    setValorCorrigido,
    calcularCorrecaoMonetaria
  };
};
