
import React from 'react';
import TabelaCalculos from './TabelaCalculos';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface CalculosImportadosProps {
  calculosImportados: any | null;
  calculosTabela: any | null;
  calculosPreview: string | null;
  onInserirCalculos: () => void;
}

const CalculosImportados: React.FC<CalculosImportadosProps> = ({ 
  calculosImportados, 
  calculosTabela, 
  calculosPreview, 
  onInserirCalculos 
}) => {
  if (calculosImportados) {
    return (
      <div className="print:hidden">
        <TabelaCalculos 
          calculos={calculosImportados} 
          onInserirNoPeticao={onInserirCalculos}
        />
      </div>
    );
  }
  
  if (!calculosImportados && calculosTabela && !calculosPreview) {
    return (
      <Card className="mb-6 print:hidden">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Cálculos Inseridos na Petição
          </CardTitle>
          <CardDescription>
            Os cálculos abaixo foram incluídos nesta petição
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-3 rounded-md text-center">
            <p className="font-medium">Valor Total: {calculosTabela.totalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            <p className="text-sm text-gray-500">Os valores detalhados estão inclusos no documento da petição</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return null;
};

export default CalculosImportados;
