
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import AdicionaisItem from './AdicionaisItem';

interface IndenizacaoDemissaoProps {
  calcularIndenizacaoDemissao: boolean;
  valorIndenizacaoDemissao: string;
  onChange: (name: string, value: string | boolean) => void;
}

const IndenizacaoDemissao: React.FC<IndenizacaoDemissaoProps> = ({ 
  calcularIndenizacaoDemissao, 
  valorIndenizacaoDemissao, 
  onChange 
}) => {
  return (
    <AdicionaisItem
      id="calcularIndenizacaoDemissao"
      title="Indenização por Demissão Indevida"
      checked={calcularIndenizacaoDemissao}
      onChange={(checked) => onChange("calcularIndenizacaoDemissao", checked)}
    >
      <div>
        <Label htmlFor="valorIndenizacaoDemissao" className="juriscalc-label">Valor da Indenização (R$)</Label>
        <Input 
          id="valorIndenizacaoDemissao" 
          value={valorIndenizacaoDemissao}
          onChange={(e) => onChange("valorIndenizacaoDemissao", e.target.value)}
          className="juriscalc-input" 
          type="number"
          min="0"
          placeholder="Valor da indenização (padrão: salário base)"
        />
      </div>
    </AdicionaisItem>
  );
};

export default IndenizacaoDemissao;
