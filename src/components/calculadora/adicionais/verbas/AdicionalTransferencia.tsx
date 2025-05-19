
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import AdicionaisItem from './AdicionaisItem';

interface AdicionalTransferenciaProps {
  calcularAdicionalTransferencia: boolean;
  percentualAdicionalTransferencia: string;
  onChange: (name: string, value: string | boolean) => void;
}

const AdicionalTransferencia: React.FC<AdicionalTransferenciaProps> = ({ 
  calcularAdicionalTransferencia, 
  percentualAdicionalTransferencia, 
  onChange 
}) => {
  return (
    <AdicionaisItem
      id="calcularAdicionalTransferencia"
      title="Adicional de Transferência"
      checked={calcularAdicionalTransferencia}
      onChange={(checked) => onChange("calcularAdicionalTransferencia", checked)}
    >
      <div>
        <Label htmlFor="percentualAdicionalTransferencia" className="juriscalc-label">Percentual (%)</Label>
        <Input 
          id="percentualAdicionalTransferencia" 
          value={percentualAdicionalTransferencia}
          onChange={(e) => onChange("percentualAdicionalTransferencia", e.target.value)}
          className="juriscalc-input" 
          type="number"
          min="0"
          max="100"
          placeholder="25"
        />
      </div>
    </AdicionaisItem>
  );
};

export default AdicionalTransferencia;
