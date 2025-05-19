
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdicionaisItem from './AdicionaisItem';

interface FeriasVencidasProps {
  calcularFeriasVencidas: boolean;
  periodosFeriasVencidas: string;
  onChange: (name: string, value: string | boolean) => void;
}

const FeriasVencidas: React.FC<FeriasVencidasProps> = ({ 
  calcularFeriasVencidas, 
  periodosFeriasVencidas, 
  onChange 
}) => {
  return (
    <AdicionaisItem
      id="calcularFeriasVencidas"
      title="Férias Vencidas (+ 1/3)"
      checked={calcularFeriasVencidas}
      onChange={(checked) => onChange("calcularFeriasVencidas", checked)}
    >
      <div>
        <Label htmlFor="periodosFeriasVencidas" className="juriscalc-label">Períodos de Férias Vencidas</Label>
        <Select
          value={periodosFeriasVencidas}
          onValueChange={(value) => onChange("periodosFeriasVencidas", value)}
        >
          <SelectTrigger className="juriscalc-input">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 período</SelectItem>
            <SelectItem value="2">2 períodos</SelectItem>
            <SelectItem value="3">3 períodos</SelectItem>
            <SelectItem value="4">4 períodos</SelectItem>
            <SelectItem value="5">5 períodos</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </AdicionaisItem>
  );
};

export default FeriasVencidas;
