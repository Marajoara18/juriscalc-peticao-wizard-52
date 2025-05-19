
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { 
  MoreVertical, 
  Edit, 
  Trash, 
  Check, 
  FileEdit, 
  Eye, 
  FileText,
  ClipboardCheck 
} from 'lucide-react';
import { CalculoSalvo } from '@/types/calculoSalvo';

interface CalculoItemProps {
  calculo: CalculoSalvo;
  onEdit: (calculo: CalculoSalvo) => void;
  onDelete: (id: string) => void;
  onUse: (calculo: CalculoSalvo) => void;
  onReopen: (calculo: CalculoSalvo) => void;
  onPreview: (calculo: CalculoSalvo) => void;
  onVerify: (calculo: CalculoSalvo) => void;
  onUsePeticao: (calculo: CalculoSalvo) => void;
}

const CalculoItem: React.FC<CalculoItemProps> = ({
  calculo,
  onEdit,
  onDelete,
  onUse,
  onReopen,
  onPreview,
  onVerify,
  onUsePeticao
}) => {
  const valorFormatado = new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(calculo.totalGeral);
  
  const dataFormatada = new Date(calculo.timestamp).toLocaleDateString('pt-BR');
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{calculo.nome}</h3>
            <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-gray-500">
              <p>{dataFormatada}</p>
              <p className="font-semibold text-juriscalc-navy">{valorFormatado}</p>
            </div>
          </div>
          
          <div className="flex mt-3 sm:mt-0 gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-gray-700"
              onClick={() => onUse(calculo)}
            >
              <Check className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Usar</span>
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              className="text-indigo-600"
              onClick={() => onVerify(calculo)}
            >
              <ClipboardCheck className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Verificar</span>
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              className="text-green-600"
              onClick={() => onUsePeticao(calculo)}
            >
              <FileText className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Petição</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem onClick={() => onPreview(calculo)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Visualizar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onReopen(calculo)}>
                  <FileEdit className="h-4 w-4 mr-2" />
                  Reabrir cálculo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(calculo)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar nome
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-600" 
                  onClick={() => onDelete(calculo.id)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculoItem;
