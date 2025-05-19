
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
        
        // Para calcular os dias trabalhados no mês, agora incluímos o dia da demissão
        // Obter a data de demissão
        const dataDemissao = new Date(dadosContrato.dataDemissao);
        // O número de dias trabalhados é o dia do mês da data de demissão
        const dias = dataDemissao.getDate();
        
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
  
  // Função para atualizar checkboxes
  const handleCheckboxChange = (field: string, checked: boolean) => {
    setDadosContrato(prev => ({
      ...prev,
      [field]: checked
    }));
  };
  
  // Função para atualizar o tipo de rescisão
  const handleTipoRescisaoChange = (value: string) => {
    setDadosContrato(prev => ({
      ...prev,
      tipoRescisao: value as DadosContrato['tipoRescisao']
    }));
  };

  return { 
    handleDadosContratoChange,
    handleCheckboxChange,
    handleTipoRescisaoChange
  };
};
