
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PeticaoRecenteProps {
  peticao: {
    id: number;
    titulo: string;
    descricao: string;
    status: string;
    data: string;
  };
  onEditPeticao: (id: number) => void;
}

const PeticaoRecenteCard: React.FC<PeticaoRecenteProps> = ({ peticao, onEditPeticao }) => {
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
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onEditPeticao(peticao.id)}
          >
            Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PeticaoRecenteCard;
