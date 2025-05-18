
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { TipoIndiceCorrecao } from '@/data/indicesCorrecao';

interface IndiceSelecaoProps {
  indiceCorrecao: TipoIndiceCorrecao;
  onChange: (value: TipoIndiceCorrecao) => void;
}

const IndiceSelecao: React.FC<IndiceSelecaoProps> = ({ 
  indiceCorrecao, 
  onChange 
}) => {
  return (
    <div>
      <Label className="text-base font-medium">Índice de Correção</Label>
      <RadioGroup 
        value={indiceCorrecao} 
        onValueChange={(value) => onChange(value as TipoIndiceCorrecao)}
        className="flex flex-col space-y-2 mt-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="IPCA-E" id="ipca-e" />
          <Label htmlFor="ipca-e" className="cursor-pointer">
            IPCA-E (Índice Nacional de Preços ao Consumidor Amplo – Especial)
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="INPC" id="inpc" />
          <Label htmlFor="inpc" className="cursor-pointer">
            INPC (Índice Nacional de Preços ao Consumidor)
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="TR" id="tr" />
          <Label htmlFor="tr" className="cursor-pointer">
            TR (Taxa Referencial)
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default IndiceSelecao;
