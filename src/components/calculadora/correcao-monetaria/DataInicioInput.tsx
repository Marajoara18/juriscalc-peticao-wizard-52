
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface DataInicioInputProps {
  dataInicio: string;
  usarDataAdmissao: boolean;
  dataAdmissao?: string;
  onDataInicioChange: (value: string) => void;
  onUsarDataAdmissaoChange: (checked: boolean) => void;
}

const DataInicioInput: React.FC<DataInicioInputProps> = ({
  dataInicio,
  usarDataAdmissao,
  dataAdmissao,
  onDataInicioChange,
  onUsarDataAdmissaoChange
}) => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <Label htmlFor="dataInicio" className="text-base font-medium">
          Data de início do cálculo
        </Label>
        {dataAdmissao && (
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="usarDataAdmissao" 
              checked={usarDataAdmissao} 
              onCheckedChange={onUsarDataAdmissaoChange}
            />
            <Label htmlFor="usarDataAdmissao" className="text-sm cursor-pointer">
              Usar data de admissão
            </Label>
          </div>
        )}
      </div>
      <Input
        id="dataInicio"
        placeholder="dd/mm/aaaa"
        value={dataInicio}
        onChange={(e) => onDataInicioChange(e.target.value)}
        className="mt-2"
        disabled={usarDataAdmissao}
      />
    </div>
  );
};

export default DataInicioInput;
