
import React from 'react';
import { Button } from "@/components/ui/button";
import { formatarMoeda } from '@/utils/formatters';
import { Edit, Trash, FileText, RefreshCw, Printer } from "lucide-react";

interface CalculoSalvo {
  id: string;
  nome: string;
  timestamp: string;
  verbasRescisorias: any;
  adicionais: any;
  totalGeral: number;
  userId?: string;
  nomeEscritorio?: string;
  dadosContrato?: {
    dataAdmissao?: string;
    dataDemissao?: string;
    salarioBase?: string;
    tipoRescisao?: 'sem_justa_causa' | 'pedido_demissao' | 'justa_causa' | 'rescisao_indireta';
    diasTrabalhados?: string;
    mesesTrabalhados?: string;
  };
}

interface CalculoItemProps {
  calculo: CalculoSalvo;
  onEdit: (calculo: CalculoSalvo) => void;
  onDelete: (id: string) => void;
  onUse: (calculo: CalculoSalvo) => void;
  onReopen: (calculo: CalculoSalvo) => void;
  onPreview: (calculo: CalculoSalvo) => void;
  onUsePeticao: (calculo: CalculoSalvo) => void;
}

const CalculoItem: React.FC<CalculoItemProps> = ({
  calculo,
  onEdit,
  onDelete,
  onUse,
  onReopen,
  onPreview,
  onUsePeticao
}) => {
  return (
    <div 
      className="border rounded-md p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
    >
      <div>
        <h4 className="font-medium">{calculo.nome}</h4>
        <p className="text-sm text-gray-500">
          {new Date(calculo.timestamp).toLocaleDateString('pt-BR')} - 
          {formatarMoeda(calculo.totalGeral)}
        </p>
        {calculo.dadosContrato?.dataAdmissao && calculo.dadosContrato?.dataDemissao && (
          <p className="text-xs text-gray-500">
            Período: {new Date(calculo.dadosContrato.dataAdmissao).toLocaleDateString('pt-BR')} a{' '}
            {new Date(calculo.dadosContrato.dataDemissao).toLocaleDateString('pt-BR')}
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onUse(calculo)}
        >
          Usar
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onReopen(calculo)}
          className="flex items-center gap-1"
          title="Reabrir para Edição"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Reabrir</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onPreview(calculo)}
          className="flex items-center gap-1"
          title="Visualizar e Imprimir"
        >
          <Printer className="h-4 w-4" />
          <span className="hidden sm:inline">Imprimir</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onUsePeticao(calculo)}
          className="flex items-center gap-1"
          title="Usar na Petição"
        >
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Petição</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onEdit(calculo)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onDelete(calculo.id)}
          className="text-red-500 hover:bg-red-50"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CalculoItem;
