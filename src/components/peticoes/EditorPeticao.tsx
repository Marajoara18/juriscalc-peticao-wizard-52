
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "sonner";
import { PeticaoFormData, PeticaoProps } from '@/types/peticao';
import { valorPorExtenso, criarHTMLCalculosEmbutidos } from '@/utils/textUtils';

// Import subcomponents
import PeticaoHeader from './PeticaoHeader';
import CalculosImportados from './CalculosImportados';
import PeticaoForm from './PeticaoForm';
import PeticaoPrintView from './PeticaoPrintView';
import CalculosAdicionais from './CalculosAdicionais';
import PeticaoActions from './PeticaoActions';

const EditorPeticao: React.FC<PeticaoProps> = ({ 
  modelo, 
  peticao, 
  onVoltar, 
  onSave 
}) => {
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
  
  // Carregar cálculos do localStorage quando o componente for montado
  useEffect(() => {
    const calculosArmazenados = localStorage.getItem('calculosParaPeticao');
    if (calculosArmazenados) {
      try {
        setCalculosImportados(JSON.parse(calculosArmazenados));
      } catch (error) {
        console.error('Erro ao carregar cálculos:', error);
      }
    }
  }, []);

  // Efeito para renderizar o preview dos cálculos quando eles já estiverem na petição
  useEffect(() => {
    if (formData.calculosTabela) {
      setCalculosPreview("com_calculos");
    }
  }, [formData.calculosTabela]);

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
  
  // Função para gerar o HTML dos cálculos para incorporar na petição
  const gerarHTMLCalculos = () => {
    const tempDiv = document.createElement('div');
    const calculosParaInserir = calculosImportados;
    
    // Criar o componente TabelaCalculos temporariamente para capturar o HTML
    const root = document.createElement('div');
    root.id = 'temp-root';
    document.body.appendChild(root);
    
    try {
      // Renderiza a tabela de cálculos no elemento temporário
      const tempElement = document.getElementById('temp-root');
      if (tempElement) {
        tempElement.innerHTML = '';
        tempElement.style.display = 'none';
        
        // Criar manualmente o HTML da tabela com base nos dados
        const html = criarHTMLCalculosEmbutidos(calculosParaInserir);
        
        return html;
      }
      return null;
    } catch (error) {
      console.error('Erro ao gerar HTML dos cálculos:', error);
      return null;
    } finally {
      // Limpar o elemento temporário
      const tempElement = document.getElementById('temp-root');
      if (tempElement) {
        document.body.removeChild(tempElement);
      }
    }
  };
  
  // Função para inserir a tabela de cálculos na petição
  const handleInserirCalculos = () => {
    if (!calculosImportados) return;
    
    // Salvando os cálculos nos dados da petição
    setFormData(prev => ({
      ...prev,
      calculosTabela: calculosImportados
    }));
    
    // Inserir texto indicativo no final da descrição
    const textoCalculos = "\n\nOS VALORES DEVIDOS AO RECLAMANTE SOMAM " + 
      "R$ " + calculosImportados.totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + 
      " (" + valorPorExtenso(calculosImportados.totalGeral) + "), conforme demonstrativo ABAIXO.";
    
    setFormData(prev => ({
      ...prev,
      descricao: prev.descricao + textoCalculos
    }));
    
    // Definir o preview dos cálculos para mostrar na interface
    setCalculosPreview("com_calculos");
    
    toast.success('Cálculos inseridos na petição com sucesso!');
    
    // Limpar do localStorage após usar
    localStorage.removeItem('calculosParaPeticao');
    setCalculosImportados(null);
  };

  const handleSaveRascunho = () => {
    onSave({
      ...formData,
      status: 'rascunho'
    });
  };

  const handleSaveFinalized = () => {
    onSave({
      ...formData,
      status: 'finalizada'
    });
  };

  return (
    <div>
      <PeticaoHeader 
        titulo={modelo ? `Novo documento: ${modelo.titulo}` : `Editando: ${peticao?.titulo}`} 
        onVoltar={onVoltar} 
      />

      <CalculosImportados 
        calculosImportados={calculosImportados}
        calculosTabela={formData.calculosTabela}
        calculosPreview={calculosPreview}
        onInserirCalculos={handleInserirCalculos}
      />
      
      <Card className="print:shadow-none print:border-none">
        <CardHeader className="print:hidden">
          <CardTitle className="text-xl">Dados do Processo</CardTitle>
          <CardDescription>Preencha as informações necessárias para a petição</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <PeticaoForm formData={formData} onChange={handleInputChange} />
            
            <PeticaoPrintView formData={formData} />

            <CalculosAdicionais 
              formData={formData}
              onCheckboxChange={handleCheckboxChange}
              onCustomCalcChange={handleCustomCalcChange}
              toggleCustomCalc={toggleCustomCalc}
            />
            
            <PeticaoActions 
              onSaveRascunho={handleSaveRascunho}
              onSaveFinalized={handleSaveFinalized}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditorPeticao;
