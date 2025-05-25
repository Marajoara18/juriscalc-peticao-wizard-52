
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { HorasExtrasCalculo } from '@/types/calculadora';

interface HorasExtrasMultiplasProps {
  horasExtrasCalculos: HorasExtrasCalculo[];
  onChange: (horasExtrasCalculos: HorasExtrasCalculo[]) => void;
}

export const HorasExtrasMultiplas: React.FC<HorasExtrasMultiplasProps> = ({
  horasExtrasCalculos,
  onChange
}) => {
  const adicionarCalculo = () => {
    const novoCalculo: HorasExtrasCalculo = {
      id: Date.now().toString(),
      percentual: '50',
      quantidade: ''
    };
    onChange([...horasExtrasCalculos, novoCalculo]);
  };

  const removerCalculo = (id: string) => {
    onChange(horasExtrasCalculos.filter(calculo => calculo.id !== id));
  };

  const atualizarCalculo = (id: string, field: keyof HorasExtrasCalculo, valor: string) => {
    onChange(
      horasExtrasCalculos.map(calculo =>
        calculo.id === id ? { ...calculo, [field]: valor } : calculo
      )
    );
  };

  return (
    <div className="space-y-4">
      {horasExtrasCalculos.map((calculo, index) => (
        <div key={calculo.id} className="flex gap-3 items-end">
          <div className="flex-1">
            <Label htmlFor={`percentual-${calculo.id}`} className="juriscalc-label">
              Adicional de Horas Extras (%)
            </Label>
            <Select
              value={calculo.percentual}
              onValueChange={(value) => atualizarCalculo(calculo.id, 'percentual', value)}
            >
              <SelectTrigger className="juriscalc-input">
                <SelectValue placeholder="Selecione o percentual" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50">50%</SelectItem>
                <SelectItem value="60">60%</SelectItem>
                <SelectItem value="100">100%</SelectItem>
                <SelectItem value="150">150%</SelectItem>
                <SelectItem value="200">200%</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <Label htmlFor={`quantidade-${calculo.id}`} className="juriscalc-label">
              Quantidade de Horas
            </Label>
            <Input 
              id={`quantidade-${calculo.id}`}
              value={calculo.quantidade}
              onChange={(e) => atualizarCalculo(calculo.id, 'quantidade', e.target.value)}
              className="juriscalc-input" 
              type="number"
              min="0"
              step="0.5"
              placeholder="Ex: 10"
            />
          </div>
          
          <div className="flex gap-1">
            {index === 0 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={adicionarCalculo}
                className="h-10 w-10"
                title="Adicionar cálculo de horas extras"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
            
            {horasExtrasCalculos.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removerCalculo(calculo.id)}
                className="h-10 w-10 text-red-600 hover:text-red-700"
                title="Remover este cálculo"
              >
                <Minus className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
      
      {horasExtrasCalculos.length > 1 && (
        <Button
          type="button"
          variant="outline"
          onClick={adicionarCalculo}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Outro Cálculo de Horas Extras
        </Button>
      )}
    </div>
  );
};
