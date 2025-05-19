
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
            <Label className="text-sm">Tipo de trabalhador</Label>
            <RadioGroup
              value={adicionais.tipoTrabalhador || "padrao"}
              onValueChange={(value) => onChange("tipoTrabalhador", value)}
              className="grid gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="padrao" id="padrao" />
                <Label htmlFor="padrao">Trabalhador padrão</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="domestico" id="domestico" />
                <Label htmlFor="domestico">Empregado doméstico</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pescador" id="pescador" />
                <Label htmlFor="pescador">Pescador artesanal</Label>
              </div>
            </RadioGroup>
          </div>
          
          {adicionais.tipoTrabalhador === "padrao" && (
            <div className="space-y-2">
              <Label className="text-sm">O salário foi o mesmo nos 3 últimos meses?</Label>
              <RadioGroup
                value={adicionais.salarioUltimos3Meses || "sim"}
                onValueChange={(value) => onChange("salarioUltimos3Meses", value)}
                className="grid gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sim" id="mesmo-salario-sim" />
                  <Label htmlFor="mesmo-salario-sim">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao" id="mesmo-salario-nao" />
                  <Label htmlFor="mesmo-salario-nao">Não</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {adicionais.tipoTrabalhador === "padrao" && (
            <>
              {adicionais.salarioUltimos3Meses === "sim" ? (
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
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="salarioMes1" className="text-sm">
                      Salário do penúltimo mês (em R$)
                    </Label>
                    <Input
                      id="salarioMes1"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0,00"
                      value={adicionais.salarioMes1 || ""}
                      onChange={(e) => onChange("salarioMes1", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salarioMes2" className="text-sm">
                      Salário do último mês (em R$)
                    </Label>
                    <Input
                      id="salarioMes2"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0,00"
                      value={adicionais.salarioMes2 || ""}
                      onChange={(e) => onChange("salarioMes2", e.target.value)}
                    />
                  </div>
                </>
              )}
            </>
          )}

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
        </div>
      )}
    </div>
  );
};

export default SeguroDesemprego;
