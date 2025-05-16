
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PeticaoFormData } from '@/types/peticao';
import { Table } from 'lucide-react';

interface PeticaoFormProps {
  formData: PeticaoFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onInsertTableMarker?: () => void;
}

const PeticaoForm: React.FC<PeticaoFormProps> = ({ formData, onChange, onInsertTableMarker }) => {
  const handleInsertTableMarker = () => {
    if (onInsertTableMarker) {
      onInsertTableMarker();
    }
  };

  return (
    <div className="space-y-4 print:hidden">
      <div>
        <label htmlFor="titulo" className="block text-sm font-medium mb-1">Título da Petição</label>
        <Input
          id="titulo"
          name="titulo"
          type="text"
          className="w-full"
          value={formData.titulo}
          onChange={onChange}
        />
      </div>
      
      <div>
        <label htmlFor="reclamante" className="block text-sm font-medium mb-1">Nome do Reclamante</label>
        <Input
          id="reclamante"
          name="reclamante"
          type="text"
          className="w-full"
          value={formData.reclamante}
          onChange={onChange}
        />
      </div>
      
      <div>
        <label htmlFor="reclamado" className="block text-sm font-medium mb-1">Nome do Reclamado (Empresa)</label>
        <Input
          id="reclamado"
          name="reclamado"
          type="text"
          className="w-full"
          value={formData.reclamado}
          onChange={onChange}
        />
      </div>
      
      <div>
        <label htmlFor="descricao" className="block text-sm font-medium mb-1">Descrição dos Fatos</label>
        <div className="mb-2 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {formData.calculosTabela && "Use o botão para inserir a tabela de cálculos em qualquer parte do texto"}
          </span>
          {formData.calculosTabela && (
            <Button 
              type="button"
              size="sm"
              variant="outline"
              onClick={handleInsertTableMarker}
              className="flex items-center text-xs"
            >
              <Table className="h-4 w-4 mr-1" />
              Inserir Tabela de Cálculos
            </Button>
          )}
        </div>
        <Textarea
          id="descricao"
          name="descricao"
          className="w-full min-h-[150px]"
          value={formData.descricao}
          onChange={onChange}
        />
        {formData.calculosTabela && formData.descricao.includes("[TABELA_CALCULOS]") && (
          <div className="mt-2 p-2 bg-gray-50 border rounded-md">
            <p className="text-xs text-gray-600">
              A tabela de cálculos será inserida no local do marcador [TABELA_CALCULOS]
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PeticaoForm;
