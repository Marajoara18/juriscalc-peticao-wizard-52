
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Adicionais } from '@/types/calculadora';

interface AdicionaisBasicosProps {
  adicionais: Adicionais;
  onChange: (name: string, value: string | boolean) => void;
}

export const AdicionaisBasicos: React.FC<AdicionaisBasicosProps> = ({ adicionais, onChange }) => {
  return (
    <>
      {/* Insalubridade */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="calcularInsalubridade" className="font-bold">
            Adicional de Insalubridade
          </Label>
          <Switch 
            id="calcularInsalubridade"
            checked={adicionais.calcularInsalubridade}
            onCheckedChange={(checked) => onChange("calcularInsalubridade", checked)}
          />
        </div>
        
        {adicionais.calcularInsalubridade && (
          <div className="pl-4 border-l-2 border-gray-200 space-y-3">
            <div>
              <Label htmlFor="grauInsalubridade" className="juriscalc-label">Grau de Insalubridade</Label>
              <Select
                value={adicionais.grauInsalubridade}
                onValueChange={(value) => onChange("grauInsalubridade", value)}
              >
                <SelectTrigger className="juriscalc-input">
                  <SelectValue placeholder="Selecione o grau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimo">Mínimo (10%)</SelectItem>
                  <SelectItem value="medio">Médio (20%)</SelectItem>
                  <SelectItem value="maximo">Máximo (40%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="baseCalculoInsalubridade" className="juriscalc-label">Base de Cálculo</Label>
              <Select
                value={adicionais.baseCalculoInsalubridade}
                onValueChange={(value) => onChange("baseCalculoInsalubridade", value)}
              >
                <SelectTrigger className="juriscalc-input">
                  <SelectValue placeholder="Selecione a base" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salario_minimo">Salário Mínimo</SelectItem>
                  <SelectItem value="salario_base">Salário Base</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Periculosidade */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="calcularPericulosidade" className="font-bold">
            Adicional de Periculosidade
          </Label>
          <Switch 
            id="calcularPericulosidade"
            checked={adicionais.calcularPericulosidade}
            onCheckedChange={(checked) => onChange("calcularPericulosidade", checked)}
          />
        </div>
        
        {adicionais.calcularPericulosidade && (
          <div className="pl-4 border-l-2 border-gray-200 space-y-3">
            <div>
              <Label htmlFor="percentualPericulosidade" className="juriscalc-label">Percentual (%)</Label>
              <Input 
                id="percentualPericulosidade" 
                value={adicionais.percentualPericulosidade}
                onChange={(e) => onChange("percentualPericulosidade", e.target.value)}
                className="juriscalc-input" 
                type="number"
                min="0"
                max="100"
              />
            </div>
            
            <div>
              <Label htmlFor="baseCalculoPericulosidade" className="juriscalc-label">Base de Cálculo</Label>
              <Select
                value={adicionais.baseCalculoPericulosidade}
                onValueChange={(value) => onChange("baseCalculoPericulosidade", value)}
              >
                <SelectTrigger className="juriscalc-input">
                  <SelectValue placeholder="Selecione a base" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salario_base">Salário Base</SelectItem>
                  <SelectItem value="salario_minimo">Salário Mínimo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
