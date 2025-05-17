
import { Resultados } from '@/types/calculadora';
import { toast } from "@/components/ui/use-toast";

export const useCorrecaoMonetaria = (
  resultados: Resultados,
  setResultados: React.Dispatch<React.SetStateAction<Resultados>>
) => {
  // Função para aplicar correção monetária aos resultados
  const aplicarCorrecaoMonetaria = (valorCorrigido: number) => {
    // Aqui vamos criar uma cópia do estado atual para modificá-lo
    const novoResultados = {...resultados};
    
    // Calcular o fator de correção com base no valor original vs. valor corrigido
    // Vamos aplicar esse fator a todas as verbas calculadas
    const totalAtual = 
      novoResultados.verbasRescisorias.total + 
      Object.values(novoResultados.adicionais).reduce((acc, val) => acc + val, 0);
    
    // Se não há valor atual, não podemos calcular um fator
    if (totalAtual <= 0) {
      toast({
        title: "Erro na correção monetária",
        description: "É necessário calcular valores primeiro antes de aplicar correção.",
        variant: "destructive"
      });
      return;
    }
    
    const fatorCorrecao = valorCorrigido / totalAtual;
    
    // Aplicar o fator de correção a todas as verbas rescisórias
    Object.keys(novoResultados.verbasRescisorias).forEach(key => {
      if (key !== "total") { // Não aplicamos o fator ao total, recalcularemos depois
        novoResultados.verbasRescisorias[key as keyof typeof novoResultados.verbasRescisorias] *= fatorCorrecao;
      }
    });
    
    // Recalcular o total das verbas rescisórias
    novoResultados.verbasRescisorias.total = 
      novoResultados.verbasRescisorias.saldoSalario +
      novoResultados.verbasRescisorias.avisoPrevia +
      novoResultados.verbasRescisorias.decimoTerceiro +
      novoResultados.verbasRescisorias.ferias +
      novoResultados.verbasRescisorias.tercoConstitucional +
      novoResultados.verbasRescisorias.fgts +
      novoResultados.verbasRescisorias.multaFgts;
    
    // Aplicar o fator de correção a todos os adicionais
    Object.keys(novoResultados.adicionais).forEach(key => {
      novoResultados.adicionais[key as keyof typeof novoResultados.adicionais] *= fatorCorrecao;
    });
    
    // Atualizar o estado com os valores corrigidos
    setResultados(novoResultados);
    
    toast({
      title: "Correção monetária aplicada",
      description: "Todos os valores foram atualizados com o índice de correção monetária."
    });
  };

  return { aplicarCorrecaoMonetaria };
};
