
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import AdicionaisItem from './AdicionaisItem';

interface ValeAlimentacaoProps {
  calcularValeAlimentacao: boolean;
  valorDiarioVA: string;
  diasValeAlimentacao: string;
  onChange: (name: string, value: string | boolean) => void;
}

const ValeAlimentacao: React.FC<ValeAlimentacaoProps> = ({ 
  calcularValeAlimentacao, 
  valorDiarioVA, 
  diasValeAlimentacao, 
  onChange 
}) => {
  return (
    <AdicionaisItem
      id="calcularValeAlimentacao"
      title="Vale Alimentação Não Pago"
      checked={calcularValeAlimentacao}
      onChange={(checked) => onChange("calcularValeAlimentacao", checked)}
    >
      <div>
        <Label htmlFor="valorDiarioVA" className="juriscalc-label">Valor Diário (R$)</Label>
        <Input 
          id="valorDiarioVA" 
          value={valorDiarioVA}
          onChange={(e) => onChange("valorDiarioVA", e.target.value)}
          className="juriscalc-input" 
          type="number"
          min="0"
          step="0.01"
          placeholder="Valor diário do VA"
        />
      </div>
      <div>
        <Label htmlFor="diasValeAlimentacao" className="juriscalc-label">Dias Não Pagos</Label>
        <Input 
          id="diasValeAlimentacao" 
          value={diasValeAlimentacao}
          onChange={(e) => onChange("diasValeAlimentacao", e.target.value)}
          className="juriscalc-input" 
          type="number"
          min="0"
          placeholder="22"
        />
      </div>
    </AdicionaisItem>
  );
};

export default ValeAlimentacao;
