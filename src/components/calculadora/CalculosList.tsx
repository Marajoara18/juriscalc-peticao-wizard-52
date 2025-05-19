
import React from 'react';
import { CalculoSalvo } from '@/types/calculoSalvo';
import CalculoItem from './CalculoItem';

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
  return (
    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
      {calculosFiltrados.map((calculo) => (
        <CalculoItem
          key={calculo.id}
          calculo={calculo}
          onEdit={onEdit}
          onDelete={onDelete}
          onUse={onUse}
          onReopen={onReopen}
          onPreview={onPreview}
          onVerify={onVerify}
          onUsePeticao={onUsePeticao}
        />
      ))}
    </div>
  );
};

export default CalculosList;
