
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface ModeloProps {
  modelo: {
    id: number;
    titulo: string;
    descricao: string;
    categoria: string;
  };
  onUseModelo: (id: number) => void;
}

const ModeloCard: React.FC<ModeloProps> = ({ modelo, onUseModelo }) => {
  return (
    <Card className="cursor-pointer hover:border-juriscalc-navy transition-all">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-serif">{modelo.titulo}</CardTitle>
            <CardDescription className="mt-1 line-clamp-2">{modelo.descricao}</CardDescription>
          </div>
          <div className="w-10 h-10 rounded-full bg-juriscalc-navy/10 flex items-center justify-center shrink-0">
            <FileText size={18} className="text-juriscalc-navy" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button 
          size="sm" 
          className="w-full bg-juriscalc-navy hover:bg-opacity-90" 
          onClick={() => onUseModelo(modelo.id)}
        >
          Usar Modelo
        </Button>
      </CardContent>
    </Card>
  );
};

export default ModeloCard;
