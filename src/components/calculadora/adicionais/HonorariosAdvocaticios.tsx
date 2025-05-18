
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Adicionais } from '@/types/calculadora';

interface HonorariosAdvocaticiosProps {
  adicionais: Adicionais;
  onChange: (name: string, value: string | boolean) => void;
}

export const HonorariosAdvocaticios: React.FC<HonorariosAdvocaticiosProps> = ({ adicionais, onChange }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Label htmlFor="calcularHonorariosAdvocaticios" className="text-sm">
          Honorários Advocatícios
        </Label>
        <Switch 
          id="calcularHonorariosAdvocaticios"
          checked={adicionais.calcularHonorariosAdvocaticios || false}
          onCheckedChange={(checked) => onChange("calcularHonorariosAdvocaticios", checked)}
        />
      </div>
      
      {adicionais.calcularHonorariosAdvocaticios && (
        <div className="pl-4 border-l-2 border-gray-200 space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="percentualHonorariosAdvocaticios" className="text-sm">
              Percentual dos Honorários (%)
            </Label>
            <Input 
              id="percentualHonorariosAdvocaticios" 
              value={adicionais.percentualHonorariosAdvocaticios || '20'}
              onChange={(e) => onChange("percentualHonorariosAdvocaticios", e.target.value)}
              className="w-full" 
              type="number"
              min="1"
              max="100"
              placeholder="20"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="incluirTotalGeralHonorarios" className="text-sm">
              Incluir valor no total geral
            </Label>
            <Switch 
              id="incluirTotalGeralHonorarios"
              checked={adicionais.incluirTotalGeralHonorarios || false}
              onCheckedChange={(checked) => onChange("incluirTotalGeralHonorarios", checked)}
            />
          </div>
          
          <p className="text-xs text-gray-500">
            Os honorários serão calculados com base no percentual informado sobre o total das verbas rescisórias e adicionais.
          </p>
        </div>
      )}
    </>
  );
};
