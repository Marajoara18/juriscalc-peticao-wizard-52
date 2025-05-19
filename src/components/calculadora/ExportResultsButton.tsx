
import React from 'react';
import ExportDropdown from './ExportDropdown';

interface ExportResultsButtonProps {
  disabled?: boolean;
  resultados?: any;
}

const ExportResultsButton: React.FC<ExportResultsButtonProps> = ({ 
  disabled = false, 
  resultados 
}) => {
  return (
    <ExportDropdown 
      data={resultados}
      disabled={disabled}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      Exportar Resultados
    </ExportDropdown>
  );
};

export default ExportResultsButton;
