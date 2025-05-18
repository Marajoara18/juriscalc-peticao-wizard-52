
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Adicionais, CustomCalculo } from '@/types/calculadora';
import { Plus, Trash } from 'lucide-react';

interface CalculoPersonalizadoProps {
  adicionais: Adicionais;
  onChange: (name: string, value: string | boolean) => void;
}

export const CalculoPersonalizado: React.FC<CalculoPersonalizadoProps> = ({ adicionais, onChange }) => {
  // Initialize calculosCustom if it doesn't exist
  React.useEffect(() => {
    if (!adicionais.calculosCustom) {
      onChange('calculosCustom', []);
    }
  }, [adicionais, onChange]);

  const handleAddCalculo = () => {
    const newCalculo: CustomCalculo = {
      id: `calculo-${Date.now()}`,
      descricao: '',
      valor: ''
    };
    
    const updatedCalculos = [...(adicionais.calculosCustom || []), newCalculo];
    onChange('calculosCustom', updatedCalculos);
    onChange('calcularCustom', true);
  };

  const handleRemoveCalculo = (id: string) => {
    const updatedCalculos = (adicionais.calculosCustom || []).filter(
      calculo => calculo.id !== id
    );
    onChange('calculosCustom', updatedCalculos);
    
    // If no more custom calculations, turn off the switch
    if (updatedCalculos.length === 0) {
      onChange('calcularCustom', false);
    }
  };

  const handleCalculoChange = (id: string, field: 'descricao' | 'valor', value: string) => {
    const updatedCalculos = (adicionais.calculosCustom || []).map(calculo => {
      if (calculo.id === id) {
        return { ...calculo, [field]: value };
      }
      return calculo;
    });
    onChange('calculosCustom', updatedCalculos);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="calcularSalarioFamilia" className="font-bold">
          Adicionar Salário-Família
        </Label>
        <Switch 
          id="calcularSalarioFamilia"
          checked={adicionais.calcularSalarioFamilia || false}
          onCheckedChange={(checked) => onChange("calcularSalarioFamilia", checked)}
        />
      </div>
      
      {adicionais.calcularSalarioFamilia && (
        <div className="pl-4 border-l-2 border-gray-200 space-y-3">
          <div>
            <Label htmlFor="quantidadeFilhos" className="juriscalc-label">Quantidade de Filhos (até 14 anos)</Label>
            <Input 
              id="quantidadeFilhos" 
              value={adicionais.quantidadeFilhos || ''}
              onChange={(e) => onChange("quantidadeFilhos", e.target.value)}
              className="juriscalc-input" 
              type="number"
              min="0"
              placeholder="Informe a quantidade de filhos menores de 14 anos"
            />
          </div>
          <div className="text-xs text-gray-500">
            O valor do Salário-Família é calculado de acordo com a legislação vigente e varia conforme a faixa salarial do trabalhador.
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-4">
        <Label htmlFor="calcularCustom" className="font-bold">
          Adicionar Cálculos Personalizados
        </Label>
        <Switch 
          id="calcularCustom"
          checked={adicionais.calcularCustom}
          onCheckedChange={(checked) => {
            onChange("calcularCustom", checked);
            // Initialize with one empty calculation if turning on
            if (checked && (!adicionais.calculosCustom || adicionais.calculosCustom.length === 0)) {
              onChange('calculosCustom', [{
                id: `calculo-${Date.now()}`,
                descricao: '',
                valor: ''
              }]);
            }
          }}
        />
      </div>
      
      {adicionais.calcularCustom && (
        <div className="pl-4 border-l-2 border-gray-200 space-y-4">
          {/* Map through custom calculations */}
          {(adicionais.calculosCustom || []).map((calculo, index) => (
            <div key={calculo.id} className="space-y-3 border-b border-gray-200 pb-3 last:border-0">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">
                  Cálculo {index + 1}
                </h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRemoveCalculo(calculo.id)}
                  className="text-red-500 hover:text-red-700 p-1 h-auto"
                >
                  <Trash size={16} />
                </Button>
              </div>
              
              <div>
                <Label htmlFor={`descricao-${calculo.id}`} className="juriscalc-label">
                  Descrição do Cálculo
                </Label>
                <Input 
                  id={`descricao-${calculo.id}`}
                  value={calculo.descricao}
                  onChange={(e) => handleCalculoChange(calculo.id, 'descricao', e.target.value)}
                  className="juriscalc-input" 
                  type="text"
                  placeholder="Descrição do cálculo personalizado"
                />
              </div>
              
              <div>
                <Label htmlFor={`valor-${calculo.id}`} className="juriscalc-label">
                  Valor (R$)
                </Label>
                <Input 
                  id={`valor-${calculo.id}`}
                  value={calculo.valor}
                  onChange={(e) => handleCalculoChange(calculo.id, 'valor', e.target.value)}
                  className="juriscalc-input" 
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Valor do cálculo personalizado"
                />
              </div>
            </div>
          ))}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddCalculo}
            className="w-full flex items-center justify-center gap-1 mt-2"
          >
            <Plus size={16} />
            Adicionar Novo Cálculo
          </Button>
        </div>
      )}
    </div>
  );
};
