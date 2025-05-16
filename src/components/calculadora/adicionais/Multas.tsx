
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Adicionais } from '@/types/calculadora';

interface MultasProps {
  adicionais: Adicionais;
  onChange: (name: string, value: string | boolean) => void;
}

export const Multas: React.FC<MultasProps> = ({ adicionais, onChange }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Label htmlFor="calcularMulta467" className="text-sm">
          Multa do Art. 467 da CLT (50% sobre verbas incontroversas)
        </Label>
        <Switch 
          id="calcularMulta467"
          checked={adicionais.calcularMulta467}
          onCheckedChange={(checked) => onChange("calcularMulta467", checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="calcularMulta477" className="text-sm">
          Multa do Art. 477 da CLT (atraso no pagamento)
        </Label>
        <Switch 
          id="calcularMulta477"
          checked={adicionais.calcularMulta477}
          onCheckedChange={(checked) => onChange("calcularMulta477", checked)}
        />
      </div>
    </>
  );
};
