
import { Adicionais } from '@/types/calculadora';

export const useAdicionais = (
  adicionais: Adicionais, 
  setAdicionais: React.Dispatch<React.SetStateAction<Adicionais>>
) => {
  // Função para atualizar os dados dos adicionais
  const handleAdicionaisChange = (name: string, value: string | boolean) => {
    setAdicionais(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return { handleAdicionaisChange };
};
