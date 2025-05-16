import React from 'react';
import { PeticaoFormData } from '@/types/peticao';
import TabelaCalculos from './TabelaCalculos';

interface PeticaoPrintViewProps {
  formData: PeticaoFormData;
}

const PeticaoPrintView: React.FC<PeticaoPrintViewProps> = ({ formData }) => {
  // Parse description text to find placeholder for calculation table
  const renderDescriptionWithCalculos = () => {
    if (!formData.descricao || !formData.calculosTabela) return formData.descricao;
    
    // Split the description by the special marker if it exists
    if (formData.descricao.includes("[TABELA_CALCULOS]")) {
      const parts = formData.descricao.split("[TABELA_CALCULOS]");
      
      return (
        <>
          {parts.map((part, index) => (
            <React.Fragment key={index}>
              <div className="whitespace-pre-wrap">{part}</div>
              {index < parts.length - 1 && (
                <div className="my-6 border-2 border-gray-200 rounded-md p-4 print:break-inside-avoid">
                  <TabelaCalculos 
                    calculos={formData.calculosTabela}
                    onInserirNoPeticao={() => {}}
                    embutido={true}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </>
      );
    }
    
    // If no marker, just return the description
    return <div className="whitespace-pre-wrap">{formData.descricao}</div>;
  };

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
        
        {/* Render description with embedded calculation table if marker exists */}
        <div className="mb-6">
          {renderDescriptionWithCalculos()}
        </div>
        
        {/* We'll keep this for backward compatibility but hide if using the marker approach */}
        {formData.calculosTabela && !formData.descricao.includes("[TABELA_CALCULOS]") && (
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
  
  // Check if there's a placeholder in the description
  if (formData.descricao.includes("[TABELA_CALCULOS]")) {
    const parts = formData.descricao.split("[TABELA_CALCULOS]");
    
    return (
      <>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            <div className="whitespace-pre-wrap">{part}</div>
            {index < parts.length - 1 && (
              <div className="mt-4 mb-4 border-2 border-gray-300 rounded-md p-4">
                <TabelaCalculos 
                  calculos={formData.calculosTabela}
                  onInserirNoPeticao={() => {}}
                  embutido={true}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </>
    );
  }
  
  // If no marker is found, show the old way
  return (
    <>
      <div className="whitespace-pre-wrap mb-6">{formData.descricao}</div>
      <div className="mt-6 border-t-2 border-dashed border-gray-300 pt-6">
        <TabelaCalculos 
          calculos={formData.calculosTabela}
          onInserirNoPeticao={() => {}}
          embutido={true}
        />
      </div>
    </>
  );
};

export default PeticaoPrintView;
