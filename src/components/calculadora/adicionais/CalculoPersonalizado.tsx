
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Adicionais } from '@/types/calculadora';

interface CalculoPersonalizadoProps {
  adicionais: Adicionais;
  onChange: (name: string, value: string | boolean) => void;
}

export const CalculoPersonalizado: React.FC<CalculoPersonalizadoProps> = ({ adicionais, onChange }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="calcularCustom" className="font-bold">
          Adicionar Cálculo Personalizado
        </Label>
        <Switch 
          id="calcularCustom"
          checked={adicionais.calcularCustom}
          onCheckedChange={(checked) => onChange("calcularCustom", checked)}
        />
      </div>
      
      {adicionais.calcularCustom && (
        <div className="pl-4 border-l-2 border-gray-200 space-y-3">
          <div>
            <Label htmlFor="descricaoCustom" className="juriscalc-label">Descrição do Cálculo</Label>
            <Input 
              id="descricaoCustom" 
              value={adicionais.descricaoCustom}
              onChange={(e) => onChange("descricaoCustom", e.target.value)}
              className="juriscalc-input" 
              type="text"
              placeholder="Descrição do cálculo personalizado"
            />
          </div>
          
          <div>
            <Label htmlFor="valorCustom" className="juriscalc-label">Valor (R$)</Label>
            <Input 
              id="valorCustom" 
              value={adicionais.valorCustom}
              onChange={(e) => onChange("valorCustom", e.target.value)}
              className="juriscalc-input" 
              type="number"
              min="0"
              step="0.01"
              placeholder="Valor do cálculo personalizado"
            />
          </div>
        </div>
      )}
    </div>
  );
};
