
import { useState } from 'react';
import { INDICES, TipoIndiceCorrecao } from '@/data/indicesCorrecao';
import { toast } from "@/components/ui/use-toast";

export interface CalculoCorrecaoParams {
  valor: number;
  dataInicio: string;
  indiceCorrecao: TipoIndiceCorrecao;
}

export const useCalculoCorrecao = () => {
  const [valorCorrigido, setValorCorrigido] = useState<number | null>(null);

  const calcularCorrecaoMonetaria = ({ valor, dataInicio, indiceCorrecao }: CalculoCorrecaoParams) => {
    if (isNaN(valor) || valor <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor numérico válido.",
        variant: "destructive"
      });
      return;
    }
    
    if (!dataInicio) {
      toast({
        title: "Data inválida",
        description: "Por favor, insira uma data de início.",
        variant: "destructive"
      });
      return;
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
      return;
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
      return;
    }
    
    // Em uma aplicação real, aqui buscaríamos os índices de correção
    // Para este exemplo, usaremos valores fictícios acumulados
    
    // Vamos simular um cálculo simples de correção usando
    // os índices acumulados nos últimos 12 meses
    const indicesDisponiveis = INDICES[indiceCorrecao];
    let fatorAcumulado = 1;
    
    // Para cada mês desde a data de início até hoje, aplicamos o índice
    // Simplificação: usamos os últimos valores independente da data real
    // Em uma implementação real, buscaríamos os índices exatos para o período
    const dataInicioObj = new Date(ano, mes - 1, dia);
    const mesesDecorridos = Math.max(1, 
      ((new Date().getFullYear() - dataInicioObj.getFullYear()) * 12) + 
      (new Date().getMonth() - dataInicioObj.getMonth())
    );
    
    // Aplicamos os índices do período (limitado ao que temos disponível)
    const mesesACorrigir = Math.min(mesesDecorridos, indicesDisponiveis.length);
    
    for (let i = 0; i < mesesACorrigir; i++) {
      fatorAcumulado *= (1 + (indicesDisponiveis[i].indice / 100));
    }
    
    // Calcula o valor corrigido
    const novoValorCorrigido = valor * fatorAcumulado;
    setValorCorrigido(novoValorCorrigido);
    
    return novoValorCorrigido;
  };
  
  return {
    valorCorrigido,
    setValorCorrigido,
    calcularCorrecaoMonetaria
  };
};
