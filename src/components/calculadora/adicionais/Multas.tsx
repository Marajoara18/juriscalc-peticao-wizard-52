
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
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
      
      <div className="flex items-center justify-between mt-4">
        <Label htmlFor="calcularSalarioFamilia" className="text-sm">
          Salário-Família
        </Label>
        <Switch 
          id="calcularSalarioFamilia"
          checked={adicionais.calcularSalarioFamilia || false}
          onCheckedChange={(checked) => onChange("calcularSalarioFamilia", checked)}
        />
      </div>
      
      {adicionais.calcularSalarioFamilia && (
        <div className="pl-4 border-l-2 border-gray-200 space-y-2 mt-2">
          <div className="flex flex-col">
            <Label htmlFor="quantidadeFilhos" className="text-sm mb-1">Quantidade de filhos até 14 anos</Label>
            <Input 
              id="quantidadeFilhos" 
              value={adicionais.quantidadeFilhos || ''}
              onChange={(e) => onChange("quantidadeFilhos", e.target.value)}
              className="w-full" 
              type="number"
              min="0"
              placeholder="Informe a quantidade de filhos"
            />
          </div>
          <p className="text-xs text-gray-500">
            O benefício é concedido aos trabalhadores de baixa renda para auxiliar no sustento dos filhos de até 14 anos ou inválidos de qualquer idade.
          </p>
        </div>
      )}
    </>
  );
};
