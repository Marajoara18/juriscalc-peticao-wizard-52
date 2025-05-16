
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Adicionais } from '@/types/calculadora';

interface OutrosAdicionaisProps {
  adicionais: Adicionais;
  onChange: (name: string, value: string | boolean) => void;
}

export const OutrosAdicionais: React.FC<OutrosAdicionaisProps> = ({ adicionais, onChange }) => {
  return (
    <>
      {/* Adicional Noturno */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="calcularAdicionalNoturno" className="font-bold">
            Adicional Noturno
          </Label>
          <Switch 
            id="calcularAdicionalNoturno"
            checked={adicionais.calcularAdicionalNoturno}
            onCheckedChange={(checked) => onChange("calcularAdicionalNoturno", checked)}
          />
        </div>
        
        {adicionais.calcularAdicionalNoturno && (
          <div className="pl-4 border-l-2 border-gray-200 space-y-3">
            <div>
              <Label htmlFor="percentualAdicionalNoturno" className="juriscalc-label">Percentual (%)</Label>
              <Input 
                id="percentualAdicionalNoturno" 
                value={adicionais.percentualAdicionalNoturno}
                onChange={(e) => onChange("percentualAdicionalNoturno", e.target.value)}
                className="juriscalc-input" 
                type="number"
                min="0"
                max="100"
              />
            </div>
            
            <div>
              <Label htmlFor="horasNoturnas" className="juriscalc-label">Quantidade de Horas Noturnas</Label>
              <Input 
                id="horasNoturnas" 
                value={adicionais.horasNoturnas}
                onChange={(e) => onChange("horasNoturnas", e.target.value)}
                className="juriscalc-input" 
                type="number"
                min="0"
              />
            </div>
          </div>
        )}
      </div>

      {/* Horas Extras */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="calcularHorasExtras" className="font-bold">
            Horas Extras
          </Label>
          <Switch 
            id="calcularHorasExtras"
            checked={adicionais.calcularHorasExtras}
            onCheckedChange={(checked) => onChange("calcularHorasExtras", checked)}
          />
        </div>
        
        {adicionais.calcularHorasExtras && (
          <div className="pl-4 border-l-2 border-gray-200 space-y-3">
            <div>
              <Label htmlFor="percentualHorasExtras" className="juriscalc-label">Adicional de Horas Extras (%)</Label>
              <Select
                value={adicionais.percentualHorasExtras}
                onValueChange={(value) => onChange("percentualHorasExtras", value)}
              >
                <SelectTrigger className="juriscalc-input">
                  <SelectValue placeholder="Selecione o percentual" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">50%</SelectItem>
                  <SelectItem value="60">60%</SelectItem>
                  <SelectItem value="100">100%</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="quantidadeHorasExtras" className="juriscalc-label">Quantidade de Horas Extras</Label>
              <Input 
                id="quantidadeHorasExtras" 
                value={adicionais.quantidadeHorasExtras}
                onChange={(e) => onChange("quantidadeHorasExtras", e.target.value)}
                className="juriscalc-input" 
                type="number"
                min="0"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
