
import React from 'react';
import { PeticaoFormData } from '@/types/peticao';
import TabelaCalculos from './TabelaCalculos';

interface PeticaoPrintViewProps {
  formData: PeticaoFormData;
}

const PeticaoPrintView: React.FC<PeticaoPrintViewProps> = ({ formData }) => {
  return (
    <>
      <div className="hidden print:block print:break-inside-avoid">
        <h1 className="text-2xl font-bold text-center mb-6">{formData.titulo}</h1>
        
        <div className="mb-6">
          <p className="font-bold">RECLAMANTE:</p> 
          <p className="mb-3">{formData.reclamante || "[Nome do Reclamante]"}</p>
          
          <p className="font-bold">RECLAMADO:</p>
          <p>{formData.reclamado || "[Nome do Reclamado/Empresa]"}</p>
        </div>
        
        <div className="whitespace-pre-wrap mb-6">{formData.descricao}</div>
        
        {/* Inserir tabela de cálculos diretamente no documento quando for imprimir */}
        {formData.calculosTabela && (
          <div className="print:break-inside-avoid print:page-break-inside-avoid">
            <TabelaCalculos 
              calculos={formData.calculosTabela}
              onInserirNoPeticao={() => {}}
              embutido={true}
            />
          </div>
        )}
      </div>

      {formData.calculosTabela && (
        <div className="border-2 border-gray-200 rounded-md p-4 print:hidden">
          <h3 className="text-lg font-medium mb-3 text-juriscalc-navy">Preview da Petição com Cálculos</h3>
          <div className="p-4 bg-white border rounded-md max-h-[400px] overflow-y-auto">
            <div className="whitespace-pre-wrap mb-6">{formData.descricao}</div>
            {renderCalculosPreview(formData)}
          </div>
        </div>
      )}
    </>
  );
};

// Helper function to render the calculation preview embedded in the petition
const renderCalculosPreview = (formData: PeticaoFormData) => {
  if (!formData.calculosTabela) return null;
  
  return (
    <div className="mt-6 border-t-2 border-dashed border-gray-300 pt-6">
      <TabelaCalculos 
        calculos={formData.calculosTabela}
        onInserirNoPeticao={() => {}}
        embutido={true}
      />
    </div>
  );
};

export default PeticaoPrintView;
