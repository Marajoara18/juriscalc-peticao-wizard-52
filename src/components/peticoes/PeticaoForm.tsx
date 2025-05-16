
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PeticaoFormData } from '@/types/peticao';

interface PeticaoFormProps {
  formData: PeticaoFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const PeticaoForm: React.FC<PeticaoFormProps> = ({ formData, onChange }) => {
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
        <Textarea
          id="descricao"
          name="descricao"
          className="w-full min-h-[150px]"
          value={formData.descricao}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default PeticaoForm;
