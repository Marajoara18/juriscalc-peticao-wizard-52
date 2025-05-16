
import { useState } from 'react';
import { PeticaoFormData } from '@/types/peticao';
import { toast } from "sonner";
import { valorPorExtenso } from '@/utils/textUtils';

export const usePeticaoForm = (peticao: any, modelo: any) => {
  const [formData, setFormData] = useState<PeticaoFormData>({
    id: peticao?.id || Date.now(),
    titulo: peticao?.titulo || modelo?.titulo || '',
    descricao: peticao?.descricao || '',
    reclamante: peticao?.reclamante || '',
    reclamado: peticao?.reclamado || '',
    status: 'rascunho',
    data: new Date().toLocaleDateString('pt-BR'),
    calculosAdicionais: peticao?.calculosAdicionais || {
      feriasVencidas: false,
      indenizacaoDemissao: false,
      valeTransporte: false,
      valeAlimentacao: false,
      adicionalTransferencia: false,
      descontosIndevidos: false,
      diferencasSalariais: false,
      custom: {
        enabled: false,
        descricao: '',
        formula: ''
      }
    },
    calculosTabela: peticao?.calculosTabela || null,
    htmlCalculos: peticao?.htmlCalculos || null
  });
  
  const [calculosImportados, setCalculosImportados] = useState<any>(null);
  const [calculosPreview, setCalculosPreview] = useState<string | null>(null);
  
  // Input change handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (field: string) => {
    setFormData(prev => ({
      ...prev,
      calculosAdicionais: {
        ...prev.calculosAdicionais,
        [field]: !prev.calculosAdicionais[field]
      }
    }));
  };

  const handleCustomCalcChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      calculosAdicionais: {
        ...prev.calculosAdicionais,
        custom: {
          ...prev.calculosAdicionais.custom,
          [name]: value
        }
      }
    }));
  };

  const toggleCustomCalc = () => {
    setFormData(prev => ({
      ...prev,
      calculosAdicionais: {
        ...prev.calculosAdicionais,
        custom: {
          ...prev.calculosAdicionais.custom,
          enabled: !prev.calculosAdicionais.custom.enabled
        }
      }
    }));
  };

  // Table marker insertion
  const handleInsertTableMarker = () => {
    const textArea = document.getElementById('descricao') as HTMLTextAreaElement;
    if (!textArea) return;
    
    const cursorPosition = textArea.selectionStart;
    const textBefore = formData.descricao.substring(0, cursorPosition);
    const textAfter = formData.descricao.substring(cursorPosition);
    
    const newDescription = textBefore + "[TABELA_CALCULOS]" + textAfter;
    
    setFormData(prev => ({
      ...prev,
      descricao: newDescription
    }));
    
    toast.success('Marcador de tabela inserido. A tabela de cálculos será exibida neste local.');
  };
  
  // Insert calculations into petition
  const handleInserirCalculos = () => {
    if (!calculosImportados) return;
    
    // Salvando os cálculos nos dados da petição
    setFormData(prev => ({
      ...prev,
      calculosTabela: calculosImportados
    }));
    
    // Inserir texto indicativo no final da descrição sem adicionar automaticamente a tabela
    const textoCalculos = "\n\nOS VALORES DEVIDOS AO RECLAMANTE SOMAM " + 
      "R$ " + calculosImportados.totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + 
      " (" + valorPorExtenso(calculosImportados.totalGeral) + "), conforme demonstrativo ABAIXO.";
    
    setFormData(prev => ({
      ...prev,
      descricao: prev.descricao + textoCalculos
    }));
    
    // Definir o preview dos cálculos para mostrar na interface
    setCalculosPreview("com_calculos");
    
    toast.success('Cálculos inseridos na petição com sucesso! Use o botão "Inserir Tabela de Cálculos" para posicionar a tabela dentro do texto.');
    
    // Limpar do localStorage após usar
    localStorage.removeItem('calculosParaPeticao');
    setCalculosImportados(null);
  };

  return {
    formData,
    calculosImportados,
    calculosPreview,
    setCalculosImportados,
    setCalculosPreview,
    handleInputChange,
    handleCheckboxChange,
    handleCustomCalcChange,
    toggleCustomCalc,
    handleInsertTableMarker,
    handleInserirCalculos
  };
};
