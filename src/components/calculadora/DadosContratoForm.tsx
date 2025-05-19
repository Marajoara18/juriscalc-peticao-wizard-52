
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DadosContrato } from "@/types/calculadora";

interface DadosContratoFormProps {
  dadosContrato: DadosContrato;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTipoRescisaoChange: (value: string) => void;
  onCheckboxChange: (field: string, checked: boolean) => void;
}

const DadosContratoForm: React.FC<DadosContratoFormProps> = ({ 
  dadosContrato, 
  onChange,
  onTipoRescisaoChange,
  onCheckboxChange
}) => {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Data de Admissão */}
          <div>
            <Label htmlFor="dataAdmissao" className="juriscalc-label">Data de Admissão</Label>
            <Input 
              id="dataAdmissao" 
              name="dataAdmissao"
              value={dadosContrato.dataAdmissao}
              onChange={onChange}
              className="juriscalc-input" 
              type="date"
            />
          </div>
          
          {/* Data de Demissão */}
          <div>
            <Label htmlFor="dataDemissao" className="juriscalc-label">Data de Demissão</Label>
            <Input 
              id="dataDemissao" 
              name="dataDemissao"
              value={dadosContrato.dataDemissao}
              onChange={onChange}
              className="juriscalc-input" 
              type="date"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Salário Base */}
          <div>
            <Label htmlFor="salarioBase" className="juriscalc-label">Salário Base (R$)</Label>
            <Input 
              id="salarioBase" 
              name="salarioBase"
              value={dadosContrato.salarioBase}
              onChange={onChange}
              className="juriscalc-input" 
              type="number"
              placeholder="0,00"
              min="0"
              step="0.01"
            />
          </div>
          
          {/* Tipo de Rescisão */}
          <div>
            <Label htmlFor="tipoRescisao" className="juriscalc-label">Tipo de Rescisão</Label>
            <Select 
              value={dadosContrato.tipoRescisao}
              onValueChange={onTipoRescisaoChange}
            >
              <SelectTrigger className="juriscalc-input">
                <SelectValue placeholder="Selecione o tipo de rescisão" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sem_justa_causa">Demissão sem Justa Causa</SelectItem>
                <SelectItem value="pedido_demissao">Pedido de Demissão</SelectItem>
                <SelectItem value="justa_causa">Demissão por Justa Causa</SelectItem>
                <SelectItem value="rescisao_indireta">Rescisão Indireta</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Dias Trabalhados - agora editável com setas */}
          <div>
            <Label htmlFor="diasTrabalhados" className="juriscalc-label">
              Dias Trabalhados no último mês
            </Label>
            <Input 
              id="diasTrabalhados" 
              name="diasTrabalhados"
              value={dadosContrato.diasTrabalhados}
              onChange={onChange}
              className="juriscalc-input" 
              type="number"
              min="1"
              max="31"
              step="1"
              placeholder="0"
            />
          </div>
          
          {/* Meses Trabalhados */}
          <div>
            <Label htmlFor="mesesTrabalhados" className="juriscalc-label">Total de Meses Trabalhados</Label>
            <Input 
              id="mesesTrabalhados" 
              name="mesesTrabalhados"
              value={dadosContrato.mesesTrabalhados}
              readOnly
              className="juriscalc-input bg-gray-50" 
              type="text"
              placeholder="0"
            />
          </div>
        </div>
        
        {/* Aviso Prévio Cumprido */}
        <div className="flex items-center space-x-2 pt-2">
          <Switch 
            id="aviso_previo_cumprido"
            checked={dadosContrato.aviso_previo_cumprido}
            onCheckedChange={(checked) => onCheckboxChange("aviso_previo_cumprido", checked)}
          />
          <Label htmlFor="aviso_previo_cumprido">Aviso Prévio Cumprido</Label>
        </div>
      </CardContent>
    </Card>
  );
};

export default DadosContratoForm;
