
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
      {/* Adicional de Insalubridade */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="calcularInsalubridade" className="text-sm font-medium">
            Adicional de Insalubridade
          </Label>
          <Switch 
            id="calcularInsalubridade"
            checked={adicionais.calcularInsalubridade}
            onCheckedChange={(checked) => onChange("calcularInsalubridade", checked)}
          />
        </div>
        
        {adicionais.calcularInsalubridade && (
          <div className="pl-4 border-l-2 border-gray-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="grauInsalubridade" className="text-sm mb-1 block">Grau de Insalubridade</Label>
                <Select 
                  value={adicionais.grauInsalubridade} 
                  onValueChange={(value) => onChange("grauInsalubridade", value)}
                >
                  <SelectTrigger>
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
                <Label htmlFor="baseCalculoInsalubridade" className="text-sm mb-1 block">Base de Cálculo</Label>
                <Select 
                  value={adicionais.baseCalculoInsalubridade} 
                  onValueChange={(value) => onChange("baseCalculoInsalubridade", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a base" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salario_minimo">Salário Mínimo</SelectItem>
                    <SelectItem value="salario_base">Salário Base</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Novo switch para período específico de insalubridade */}
            <div className="flex items-center justify-between">
              <Label htmlFor="insalubridadePeriodoEspecifico" className="text-sm">
                Aplicar Insalubridade por Período Específico?
              </Label>
              <Switch 
                id="insalubridadePeriodoEspecifico"
                checked={adicionais.insalubridadePeriodoEspecifico || false}
                onCheckedChange={(checked) => onChange("insalubridadePeriodoEspecifico", checked)}
              />
            </div>
            
            {/* Campos de data condicionais para insalubridade */}
            {adicionais.insalubridadePeriodoEspecifico && (
              <div className="pl-4 border-l-2 border-blue-200 space-y-3 bg-blue-50 p-3 rounded">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dataInicioInsalubridade" className="text-sm mb-1 block">
                      Data de Início da Insalubridade
                    </Label>
                    <Input 
                      id="dataInicioInsalubridade"
                      type="date"
                      value={adicionais.dataInicioInsalubridade || ''}
                      onChange={(e) => onChange("dataInicioInsalubridade", e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dataFimInsalubridade" className="text-sm mb-1 block">
                      Data de Fim da Insalubridade
                    </Label>
                    <Input 
                      id="dataFimInsalubridade"
                      type="date"
                      value={adicionais.dataFimInsalubridade || ''}
                      onChange={(e) => onChange("dataFimInsalubridade", e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
                <p className="text-xs text-blue-600">
                  O adicional será aplicado apenas durante o período especificado.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Adicional de Periculosidade */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="calcularPericulosidade" className="text-sm font-medium">
            Adicional de Periculosidade
          </Label>
          <Switch 
            id="calcularPericulosidade"
            checked={adicionais.calcularPericulosidade}
            onCheckedChange={(checked) => onChange("calcularPericulosidade", checked)}
          />
        </div>
        
        {adicionais.calcularPericulosidade && (
          <div className="pl-4 border-l-2 border-gray-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="percentualPericulosidade" className="text-sm mb-1 block">Percentual (%)</Label>
                <Input 
                  id="percentualPericulosidade"
                  type="number"
                  value={adicionais.percentualPericulosidade}
                  onChange={(e) => onChange("percentualPericulosidade", e.target.value)}
                  placeholder="30"
                  className="w-full"
                />
              </div>
              
              <div>
                <Label htmlFor="baseCalculoPericulosidade" className="text-sm mb-1 block">Base de Cálculo</Label>
                <Select 
                  value={adicionais.baseCalculoPericulosidade} 
                  onValueChange={(value) => onChange("baseCalculoPericulosidade", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a base" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salario_base">Salário Base</SelectItem>
                    <SelectItem value="salario_minimo">Salário Mínimo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Novo switch para período específico de periculosidade */}
            <div className="flex items-center justify-between">
              <Label htmlFor="periculosidadePeriodoEspecifico" className="text-sm">
                Aplicar Periculosidade por Período Específico?
              </Label>
              <Switch 
                id="periculosidadePeriodoEspecifico"
                checked={adicionais.periculosidadePeriodoEspecifico || false}
                onCheckedChange={(checked) => onChange("periculosidadePeriodoEspecifico", checked)}
              />
            </div>
            
            {/* Campos de data condicionais para periculosidade */}
            {adicionais.periculosidadePeriodoEspecifico && (
              <div className="pl-4 border-l-2 border-orange-200 space-y-3 bg-orange-50 p-3 rounded">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dataInicioPericulosidade" className="text-sm mb-1 block">
                      Data de Início da Periculosidade
                    </Label>
                    <Input 
                      id="dataInicioPericulosidade"
                      type="date"
                      value={adicionais.dataInicioPericulosidade || ''}
                      onChange={(e) => onChange("dataInicioPericulosidade", e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dataFimPericulosidade" className="text-sm mb-1 block">
                      Data de Fim da Periculosidade
                    </Label>
                    <Input 
                      id="dataFimPericulosidade"
                      type="date"
                      value={adicionais.dataFimPericulosidade || ''}
                      onChange={(e) => onChange("dataFimPericulosidade", e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
                <p className="text-xs text-orange-600">
                  O adicional será aplicado apenas durante o período especificado.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
