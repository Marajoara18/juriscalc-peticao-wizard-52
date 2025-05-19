
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import AdicionaisItem from './AdicionaisItem';

interface ValeTransporteProps {
  calcularValeTransporte: boolean;
  valorDiarioVT: string;
  diasValeTransporte: string;
  onChange: (name: string, value: string | boolean) => void;
}

const ValeTransporte: React.FC<ValeTransporteProps> = ({ 
  calcularValeTransporte, 
  valorDiarioVT, 
  diasValeTransporte, 
  onChange 
}) => {
  return (
    <AdicionaisItem
      id="calcularValeTransporte"
      title="Vale Transporte Não Pago"
      checked={calcularValeTransporte}
      onChange={(checked) => onChange("calcularValeTransporte", checked)}
    >
      <div>
        <Label htmlFor="valorDiarioVT" className="juriscalc-label">Valor Diário (R$)</Label>
        <Input 
          id="valorDiarioVT" 
          value={valorDiarioVT}
          onChange={(e) => onChange("valorDiarioVT", e.target.value)}
          className="juriscalc-input" 
          type="number"
          min="0"
          step="0.01"
          placeholder="Valor diário do VT"
        />
      </div>
      <div>
        <Label htmlFor="diasValeTransporte" className="juriscalc-label">Dias Não Pagos</Label>
        <Input 
          id="diasValeTransporte" 
          value={diasValeTransporte}
          onChange={(e) => onChange("diasValeTransporte", e.target.value)}
          className="juriscalc-input" 
          type="number"
          min="0"
          placeholder="22"
        />
      </div>
    </AdicionaisItem>
  );
};

export default ValeTransporte;
