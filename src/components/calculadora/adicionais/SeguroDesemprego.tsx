
import React, { useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Adicionais } from '@/types/calculadora';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SeguroDesempregoProps {
  adicionais: Adicionais;
  dadosContrato?: {
    salarioBase: string;
  };
  onChange: (name: string, value: string | boolean) => void;
}

export const SeguroDesemprego: React.FC<SeguroDesempregoProps> = ({ adicionais, dadosContrato, onChange }) => {
  // Fill in the last salary with base salary when "same salary for 3 months" is selected
  useEffect(() => {
    if (adicionais.calcularSeguroDesemprego && 
        adicionais.salarioUltimos3Meses === 'sim' && 
        dadosContrato?.salarioBase && 
        !adicionais.ultimoSalario) {
      onChange("ultimoSalario", dadosContrato.salarioBase);
    }
  }, [adicionais.calcularSeguroDesemprego, adicionais.salarioUltimos3Meses, dadosContrato?.salarioBase]);

  const handleUsarSalarioBase = () => {
    if (dadosContrato?.salarioBase) {
      onChange("ultimoSalario", dadosContrato.salarioBase);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="calcularSeguroDesemprego" className="font-bold">
          Calcular Seguro-Desemprego
        </Label>
        <Switch 
          id="calcularSeguroDesemprego"
          checked={adicionais.calcularSeguroDesemprego}
          onCheckedChange={(checked) => onChange("calcularSeguroDesemprego", checked)}
        />
      </div>
      
      {adicionais.calcularSeguroDesemprego && (
        <div className="pl-4 border-l-2 border-gray-200 space-y-3">
          <div>
            <Label htmlFor="tipoTrabalhador" className="juriscalc-label">Tipo de Trabalhador</Label>
            <Select
              value={adicionais.tipoTrabalhador || 'padrao'}
              onValueChange={(value) => onChange("tipoTrabalhador", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o tipo de trabalhador" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="padrao">Trabalhador Formal</SelectItem>
                <SelectItem value="domestico">Empregado Doméstico</SelectItem>
                <SelectItem value="pescador">Pescador Artesanal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {adicionais.tipoTrabalhador === 'padrao' && (
            <>
              <div>
                <Label htmlFor="salarioUltimos3Meses" className="juriscalc-label">O salário foi o mesmo nos 3 últimos meses?</Label>
                <Select
                  value={adicionais.salarioUltimos3Meses || 'sim'}
                  onValueChange={(value) => onChange("salarioUltimos3Meses", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sim">Sim</SelectItem>
                    <SelectItem value="nao">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {adicionais.salarioUltimos3Meses === 'sim' ? (
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <Label htmlFor="ultimoSalario" className="juriscalc-label">Último Salário Recebido (R$)</Label>
                    {dadosContrato?.salarioBase && (
                      <button 
                        type="button"
                        onClick={handleUsarSalarioBase}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Usar salário base
                      </button>
                    )}
                  </div>
                  <Input 
                    id="ultimoSalario" 
                    value={adicionais.ultimoSalario || ''}
                    onChange={(e) => onChange("ultimoSalario", e.target.value)}
                    className="juriscalc-input" 
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Informe o último salário recebido"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <div className="flex justify-between items-end mb-1">
                      <Label htmlFor="ultimoSalario" className="juriscalc-label">Último Salário Recebido (R$)</Label>
                      {dadosContrato?.salarioBase && (
                        <button 
                          type="button"
                          onClick={handleUsarSalarioBase}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Usar salário base
                        </button>
                      )}
                    </div>
                    <Input 
                      id="ultimoSalario" 
                      value={adicionais.ultimoSalario || ''}
                      onChange={(e) => onChange("ultimoSalario", e.target.value)}
                      className="juriscalc-input" 
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Informe o último salário recebido"
                    />
                  </div>
                  <div>
                    <Label htmlFor="salarioMes1" className="juriscalc-label">Salário Penúltimo Mês (R$)</Label>
                    <Input 
                      id="salarioMes1" 
                      value={adicionais.salarioMes1 || ''}
                      onChange={(e) => onChange("salarioMes1", e.target.value)}
                      className="juriscalc-input" 
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Informe o salário do penúltimo mês"
                    />
                  </div>
                  <div>
                    <Label htmlFor="salarioMes2" className="juriscalc-label">Salário Antepenúltimo Mês (R$)</Label>
                    <Input 
                      id="salarioMes2" 
                      value={adicionais.salarioMes2 || ''}
                      onChange={(e) => onChange("salarioMes2", e.target.value)}
                      className="juriscalc-input" 
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Informe o salário do antepenúltimo mês"
                    />
                  </div>
                </>
              )}
            </>
          )}
          
          <div>
            <Label htmlFor="mesesTrabalhadosUltimoEmprego" className="juriscalc-label">Meses Trabalhados no Último Emprego</Label>
            <Input 
              id="mesesTrabalhadosUltimoEmprego" 
              value={adicionais.mesesTrabalhadosUltimoEmprego || ''}
              onChange={(e) => onChange("mesesTrabalhadosUltimoEmprego", e.target.value)}
              className="juriscalc-input" 
              type="number"
              min="0"
              step="1"
              placeholder="Meses trabalhados no último emprego"
            />
          </div>
        </div>
      )}
    </div>
  );
};
