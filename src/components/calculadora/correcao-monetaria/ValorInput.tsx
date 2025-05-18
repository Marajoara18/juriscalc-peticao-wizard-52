
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { formatarMoeda } from '@/utils/formatters';

interface ValorInputProps {
  valor: string;
  usarTotalGeral: boolean;
  totalGeral?: number;
  onValorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUsarTotalGeralChange: (checked: boolean) => void;
}

const ValorInput: React.FC<ValorInputProps> = ({
  valor,
  usarTotalGeral,
  totalGeral = 0,
  onValorChange,
  onUsarTotalGeralChange
}) => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <Label htmlFor="valor" className="text-base font-medium">
          Valor a ser atualizado
        </Label>
        {totalGeral > 0 && (
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="usarTotalGeral" 
              checked={usarTotalGeral} 
              onCheckedChange={onUsarTotalGeralChange}
            />
            <Label htmlFor="usarTotalGeral" className="text-sm cursor-pointer">
              Usar Total Geral ({formatarMoeda(totalGeral)})
            </Label>
          </div>
        )}
      </div>
      <Input
        id="valor"
        placeholder="R$ 0,00"
        value={usarTotalGeral && totalGeral > 0 ? formatarMoeda(totalGeral) : valor}
        onChange={onValorChange}
        className="mt-2"
        disabled={usarTotalGeral}
      />
    </div>
  );
};

export default ValorInput;
