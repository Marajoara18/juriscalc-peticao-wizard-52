
import React from 'react';
import { CalculoSalvo } from '@/types/calculoSalvo';
import CalculoItem from './CalculoItem';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface CalculosListProps {
  calculosFiltrados: CalculoSalvo[];
  onEdit: (calculo: CalculoSalvo) => void;
  onDelete: (id: string) => void;
  onUse: (calculo: CalculoSalvo) => void;
  onReopen: (calculo: CalculoSalvo) => void;
  onPreview: (calculo: CalculoSalvo) => void;
  onVerify: (calculo: CalculoSalvo) => void;
  onUsePeticao: (calculo: CalculoSalvo) => void;
}

const CalculosList: React.FC<CalculosListProps> = ({
  calculosFiltrados,
  onEdit,
  onDelete,
  onUse,
  onReopen,
  onPreview,
  onVerify,
  onUsePeticao
}) => {
  // Constante para o limite máximo de cálculos
  const LIMITE_CALCULOS = 3;
  const calculosRestantes = Math.max(0, LIMITE_CALCULOS - calculosFiltrados.length);

  return (
    <div>
      <Alert className="mb-4 bg-blue-50 text-blue-800 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-sm">
          Você está utilizando {calculosFiltrados.length} de {LIMITE_CALCULOS} cálculos disponíveis. 
          {calculosRestantes > 0 
            ? ` Você ainda pode salvar ${calculosRestantes} cálculo${calculosRestantes !== 1 ? 's' : ''}.` 
            : ' Você atingiu o limite de cálculos salvos. Para adicionar novos, apague algum existente.'}
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {calculosFiltrados.map((calculo) => (
          <CalculoItem
            key={calculo.id}
            calculo={calculo}
            onEdit={() => onEdit(calculo)}
            onDelete={() => onDelete(calculo.id)}
            onUse={() => onUse(calculo)}
            onReopen={() => onReopen(calculo)}
            onPreview={() => onPreview(calculo)}
            onVerify={() => onVerify(calculo)}
            onUsePeticao={() => onUsePeticao(calculo)}
          />
        ))}
      </div>
    </div>
  );
};

export default CalculosList;
