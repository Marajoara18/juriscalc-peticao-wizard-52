
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Trash } from 'lucide-react';

interface PeticaoRecenteProps {
  peticao: {
    id: number;
    titulo: string;
    descricao: string;
    status: string;
    data: string;
  };
  onEditPeticao: (id: number) => void;
  onDeletePeticao?: (id: number) => void;
}

const PeticaoRecenteCard: React.FC<PeticaoRecenteProps> = ({ peticao, onEditPeticao, onDeletePeticao }) => {
  const handlePrint = () => {
    // Store the ID of the petition to print
    localStorage.setItem('peticaoToPrint', String(peticao.id));
    // Navigate to the petition and trigger print
    onEditPeticao(peticao.id);
    // Set a small timeout to ensure the content is loaded before printing
    setTimeout(() => {
      window.print();
      localStorage.removeItem('peticaoToPrint');
    }, 500);
  };

  const handleDelete = () => {
    if (onDeletePeticao && window.confirm('Tem certeza que deseja excluir esta petição?')) {
      onDeletePeticao(peticao.id);
    }
  };

  return (
    <Card className="cursor-pointer hover:border-juriscalc-navy transition-all">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-serif">{peticao.titulo}</CardTitle>
            <CardDescription className="mt-1">{peticao.descricao}</CardDescription>
          </div>
          <div className={`px-2 py-1 rounded text-xs font-medium ${
            peticao.status === 'finalizada' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-amber-100 text-amber-800'
          }`}>
            {peticao.status === 'finalizada' ? 'Finalizada' : 'Rascunho'}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Criada em {peticao.data}
          </div>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4 mr-1" />
              Imprimir
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onEditPeticao(peticao.id)}
            >
              Editar
            </Button>
            {onDeletePeticao && (
              <Button 
                size="sm" 
                variant="outline"
                className="text-red-500 hover:bg-red-50"
                onClick={handleDelete}
              >
                <Trash className="h-4 w-4" />
                Excluir
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PeticaoRecenteCard;
