
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DadosContrato } from '@/types/calculadora';

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
    <Card>
      <CardHeader>
        <CardTitle>Dados do Contrato</CardTitle>
        <CardDescription>
          Informe os dados básicos do contrato de trabalho
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="dataAdmissao" className="juriscalc-label">Data de Admissão</Label>
            <Input 
              id="dataAdmissao" 
              name="dataAdmissao"
              type="date" 
              value={dadosContrato.dataAdmissao}
              onChange={onChange}
              className="juriscalc-input" 
            />
          </div>
          <div>
            <Label htmlFor="dataDemissao" className="juriscalc-label">Data de Demissão</Label>
            <Input 
              id="dataDemissao" 
              name="dataDemissao"
              type="date" 
              value={dadosContrato.dataDemissao}
              onChange={onChange}
              className="juriscalc-input" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="salarioBase" className="juriscalc-label">Salário Base (R$)</Label>
            <Input 
              id="salarioBase" 
              name="salarioBase"
              type="number" 
              placeholder="0,00" 
              value={dadosContrato.salarioBase}
              onChange={onChange}
              className="juriscalc-input" 
            />
          </div>
          <div>
            <Label htmlFor="tipoRescisao" className="juriscalc-label">Tipo de Rescisão</Label>
            <Select 
              value={dadosContrato.tipoRescisao} 
              onValueChange={onTipoRescisaoChange}
            >
              <SelectTrigger className="juriscalc-input">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sem_justa_causa">Sem Justa Causa (Empregador)</SelectItem>
                <SelectItem value="pedido_demissao">Pedido de Demissão</SelectItem>
                <SelectItem value="justa_causa">Justa Causa</SelectItem>
                <SelectItem value="rescisao_indireta">Rescisão Indireta</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="diasTrabalhados" className="juriscalc-label">Dias Trabalhados no Mês da Rescisão</Label>
            <Input 
              id="diasTrabalhados" 
              name="diasTrabalhados"
              type="number" 
              placeholder="0" 
              value={dadosContrato.diasTrabalhados}
              onChange={onChange}
              className="juriscalc-input" 
            />
          </div>
          <div>
            <Label htmlFor="mesesTrabalhados" className="juriscalc-label">Meses Trabalhados no Ano</Label>
            <Input 
              id="mesesTrabalhados" 
              name="mesesTrabalhados"
              type="number" 
              placeholder="0" 
              value={dadosContrato.mesesTrabalhados}
              onChange={onChange}
              className="juriscalc-input" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="aviso_previo_cumprido"
              checked={dadosContrato.aviso_previo_cumprido || false}
              onCheckedChange={(checked) => onCheckboxChange('aviso_previo_cumprido', checked as boolean)}
            />
            <Label 
              htmlFor="aviso_previo_cumprido" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Aviso prévio foi cumprido
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="ferias_vencidas"
              checked={dadosContrato.ferias_vencidas || false} 
              onCheckedChange={(checked) => onCheckboxChange('ferias_vencidas', checked as boolean)}
            />
            <Label 
              htmlFor="ferias_vencidas" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Possui férias vencidas (12 meses completos)
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DadosContratoForm;
