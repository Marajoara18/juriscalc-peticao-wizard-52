
import { useEffect } from 'react';
import { calcularMesesEntreDatas, calcularDiasEntreDatas } from '@/utils/formatters';
import { DadosContrato } from '@/types/calculadora';

export const useDadosContrato = (
  dadosContrato: DadosContrato, 
  setDadosContrato: React.Dispatch<React.SetStateAction<DadosContrato>>
) => {
  // Efeito para calcular automaticamente dias e meses trabalhados quando as datas são alteradas
  useEffect(() => {
    if (dadosContrato.dataAdmissao && dadosContrato.dataDemissao) {
      try {
        const meses = calcularMesesEntreDatas(dadosContrato.dataAdmissao, dadosContrato.dataDemissao);
        const dias = calcularDiasEntreDatas(
          `${dadosContrato.dataDemissao.slice(0, 7)}-01`, 
          dadosContrato.dataDemissao
        );
        
        setDadosContrato(prev => ({
          ...prev,
          mesesTrabalhados: String(meses),
          diasTrabalhados: String(dias)
        }));
      } catch (error) {
        console.error("Erro ao calcular período:", error);
      }
    }
  }, [dadosContrato.dataAdmissao, dadosContrato.dataDemissao]);

  // Função para atualizar os dados do contrato
  const handleDadosContratoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDadosContrato(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return { handleDadosContratoChange };
};
