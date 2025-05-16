
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Adicionais } from '@/types/calculadora';

interface SeguroDesempregoProps {
  adicionais: Adicionais;
  onChange: (name: string, value: string | boolean) => void;
}

export const SeguroDesemprego: React.FC<SeguroDesempregoProps> = ({ adicionais, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="calcularSeguroDesemprego" className="text-sm">
          Calcular Seguro-Desemprego
        </Label>
        <Switch 
          id="calcularSeguroDesemprego"
          checked={adicionais.calcularSeguroDesemprego}
          onCheckedChange={(checked) => onChange("calcularSeguroDesemprego", checked)}
        />
      </div>

      {adicionais.calcularSeguroDesemprego && (
        <div className="space-y-4 pl-6 border-l-2 border-gray-200">
          <div className="space-y-2">
            <Label htmlFor="ultimoSalario" className="text-sm">
              Último salário recebido (em R$)
            </Label>
            <Input
              id="ultimoSalario"
              type="number"
              min="0"
              step="0.01"
              placeholder="0,00"
              value={adicionais.ultimoSalario}
              onChange={(e) => onChange("ultimoSalario", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mesesTrabalhadosUltimoEmprego" className="text-sm">
              Número de meses trabalhados no último emprego
            </Label>
            <Input
              id="mesesTrabalhadosUltimoEmprego"
              type="number"
              min="0"
              placeholder="0"
              value={adicionais.mesesTrabalhadosUltimoEmprego}
              onChange={(e) => onChange("mesesTrabalhadosUltimoEmprego", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tempoContribuicaoINSS" className="text-sm">
              Tempo total de contribuição para o INSS (em anos)
            </Label>
            <Input
              id="tempoContribuicaoINSS"
              type="number"
              min="0"
              step="0.5"
              placeholder="0"
              value={adicionais.tempoContribuicaoINSS}
              onChange={(e) => onChange("tempoContribuicaoINSS", e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SeguroDesemprego;
