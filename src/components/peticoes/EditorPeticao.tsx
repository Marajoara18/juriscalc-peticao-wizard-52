
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "sonner";
import { PeticaoProps } from '@/types/peticao';
import { usePeticaoForm } from '@/hooks/usePeticaoForm';
import { handlePrint } from '@/utils/peticaoUtils';

// Import subcomponents
import PeticaoHeader from './PeticaoHeader';
import CalculosImportados from './CalculosImportados';
import PeticaoForm from './PeticaoForm';
import PeticaoPrintView from './PeticaoPrintView';
import PeticaoActions from './PeticaoActions';
import SharePeticaoButton from './SharePeticaoButton';

const EditorPeticao: React.FC<PeticaoProps> = ({ 
  modelo, 
  peticao, 
  onVoltar, 
  onSave 
}) => {
  const {
    formData,
    calculosImportados,
    calculosPreview,
    setCalculosImportados,
    setCalculosPreview,
    handleInputChange,
    handleInsertTableMarker,
    handleInserirCalculos
  } = usePeticaoForm(peticao, modelo);
  
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

  const handlePrintPeticao = () => {
    // Verifica se há conteúdo para imprimir
    if (!formData.titulo) {
      toast.error('Adicione pelo menos um título antes de imprimir a petição.');
      return;
    }
    
    // Aciona a funcionalidade de impressão do navegador
    handlePrint();
    
    toast.success('Petição enviada para impressão!');
  };

  const isFinalized = peticao?.status === 'finalizada';

  return (
    <div>
      <PeticaoHeader 
        titulo={modelo ? `Novo documento: ${modelo.titulo}` : `Editando: ${peticao?.titulo}`} 
        onVoltar={onVoltar}
        rightContent={
          peticao && (
            <SharePeticaoButton 
              titulo={peticao.titulo} 
              id={peticao.id}
              isFinalized={isFinalized} 
            />
          )
        }
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
            <PeticaoForm 
              formData={formData} 
              onChange={handleInputChange} 
              onInsertTableMarker={handleInsertTableMarker}
            />
            
            <PeticaoPrintView formData={formData} />
            
            <PeticaoActions 
              onSaveRascunho={handleSaveRascunho}
              onSaveFinalized={handleSaveFinalized}
              onPrint={handlePrintPeticao}
              isFinalized={isFinalized}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditorPeticao;
