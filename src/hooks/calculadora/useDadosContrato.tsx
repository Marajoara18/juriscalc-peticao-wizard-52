
import { useEffect } from 'react';
import { calcularMesesEntreDatas } from '@/utils/formatters';
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
        
        // Obter o dia exato da data de demissão sem nenhuma alteração
        const dataDemissao = new Date(dadosContrato.dataDemissao);
        // Usar o dia do mês como está na data de demissão e adicionar um dia
        const dias = dataDemissao.getDate() + 1;
        
        console.log("Data Demissão:", dataDemissao);
        console.log("Dia extraído + 1:", dias);
        
        setDadosContrato(prev => ({
          ...prev,
          mesesTrabalhados: String(meses),
          diasTrabalhados: String(dias)
        }));
      } catch (error) {
        console.error("Erro ao calcular período:", error);
      }
    }
  }, [dadosContrato.dataAdmissao, dadosContrato.dataDemissao, setDadosContrato]);

  // Função para atualizar os dados do contrato
  const handleDadosContratoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Se for mudança nas datas, garantimos que não manipulamos o valor
    if (name === 'dataAdmissao' || name === 'dataDemissao') {
      setDadosContrato(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setDadosContrato(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
