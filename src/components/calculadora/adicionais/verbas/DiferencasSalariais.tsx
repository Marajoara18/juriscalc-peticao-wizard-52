
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import AdicionaisItem from './AdicionaisItem';

interface DiferencasSalariaisProps {
  calcularDiferencasSalariais: boolean;
  valorDiferencasSalariais: string;
  onChange: (name: string, value: string | boolean) => void;
}

const DiferencasSalariais: React.FC<DiferencasSalariaisProps> = ({ 
  calcularDiferencasSalariais, 
  valorDiferencasSalariais, 
  onChange 
}) => {
  return (
    <AdicionaisItem
      id="calcularDiferencasSalariais"
      title="Diferenças Salariais"
      checked={calcularDiferencasSalariais}
      onChange={(checked) => onChange("calcularDiferencasSalariais", checked)}
    >
      <div>
        <Label htmlFor="valorDiferencasSalariais" className="juriscalc-label">Valor Total das Diferenças (R$)</Label>
        <Input 
          id="valorDiferencasSalariais" 
          value={valorDiferencasSalariais}
          onChange={(e) => onChange("valorDiferencasSalariais", e.target.value)}
          className="juriscalc-input" 
          type="number"
          min="0"
          step="0.01"
          placeholder="Valor total das diferenças salariais"
        />
      </div>
    </AdicionaisItem>
  );
};

export default DiferencasSalariais;
