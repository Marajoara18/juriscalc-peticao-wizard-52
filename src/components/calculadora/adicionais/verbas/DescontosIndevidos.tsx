
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import AdicionaisItem from './AdicionaisItem';

interface DescontosIndevidosProps {
  calcularDescontosIndevidos: boolean;
  valorDescontosIndevidos: string;
  onChange: (name: string, value: string | boolean) => void;
}

const DescontosIndevidos: React.FC<DescontosIndevidosProps> = ({ 
  calcularDescontosIndevidos, 
  valorDescontosIndevidos, 
  onChange 
}) => {
  return (
    <AdicionaisItem
      id="calcularDescontosIndevidos"
      title="Descontos Indevidos"
      checked={calcularDescontosIndevidos}
      onChange={(checked) => onChange("calcularDescontosIndevidos", checked)}
    >
      <div>
        <Label htmlFor="valorDescontosIndevidos" className="juriscalc-label">Valor Total dos Descontos (R$)</Label>
        <Input 
          id="valorDescontosIndevidos" 
          value={valorDescontosIndevidos}
          onChange={(e) => onChange("valorDescontosIndevidos", e.target.value)}
          className="juriscalc-input" 
          type="number"
          min="0"
          step="0.01"
          placeholder="Valor total dos descontos indevidos"
        />
      </div>
    </AdicionaisItem>
  );
};

export default DescontosIndevidos;
