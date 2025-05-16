
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Adicionais } from '@/types/calculadora';

interface VerbasAdicionaisProps {
  adicionais: Adicionais;
  onChange: (name: string, value: string | boolean) => void;
}

export const VerbasAdicionais: React.FC<VerbasAdicionaisProps> = ({ adicionais, onChange }) => {
  return (
    <>
      {/* Férias Vencidas */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="calcularFeriasVencidas" className="font-bold">
            Férias Vencidas (+ 1/3)
          </Label>
          <Switch 
            id="calcularFeriasVencidas"
            checked={adicionais.calcularFeriasVencidas}
            onCheckedChange={(checked) => onChange("calcularFeriasVencidas", checked)}
          />
        </div>
        
        {adicionais.calcularFeriasVencidas && (
          <div className="pl-4 border-l-2 border-gray-200 space-y-3">
            <div>
              <Label htmlFor="periodosFeriasVencidas" className="juriscalc-label">Períodos de Férias Vencidas</Label>
              <Select
                value={adicionais.periodosFeriasVencidas}
                onValueChange={(value) => onChange("periodosFeriasVencidas", value)}
              >
                <SelectTrigger className="juriscalc-input">
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 período</SelectItem>
                  <SelectItem value="2">2 períodos</SelectItem>
                  <SelectItem value="3">3 períodos</SelectItem>
                  <SelectItem value="4">4 períodos</SelectItem>
                  <SelectItem value="5">5 períodos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
      
      {/* Indenização por demissão sem justa causa */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="calcularIndenizacaoDemissao" className="font-bold">
            Indenização por Demissão Indevida
          </Label>
          <Switch 
            id="calcularIndenizacaoDemissao"
            checked={adicionais.calcularIndenizacaoDemissao}
            onCheckedChange={(checked) => onChange("calcularIndenizacaoDemissao", checked)}
          />
        </div>
        
        {adicionais.calcularIndenizacaoDemissao && (
          <div className="pl-4 border-l-2 border-gray-200 space-y-3">
            <div>
              <Label htmlFor="valorIndenizacaoDemissao" className="juriscalc-label">Valor da Indenização (R$)</Label>
              <Input 
                id="valorIndenizacaoDemissao" 
                value={adicionais.valorIndenizacaoDemissao}
                onChange={(e) => onChange("valorIndenizacaoDemissao", e.target.value)}
                className="juriscalc-input" 
                type="number"
                min="0"
                placeholder="Valor da indenização (padrão: salário base)"
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Vale Transporte */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="calcularValeTransporte" className="font-bold">
            Vale Transporte Não Pago
          </Label>
          <Switch 
            id="calcularValeTransporte"
            checked={adicionais.calcularValeTransporte}
            onCheckedChange={(checked) => onChange("calcularValeTransporte", checked)}
          />
        </div>
        
        {adicionais.calcularValeTransporte && (
          <div className="pl-4 border-l-2 border-gray-200 space-y-3">
            <div>
              <Label htmlFor="valorDiarioVT" className="juriscalc-label">Valor Diário (R$)</Label>
              <Input 
                id="valorDiarioVT" 
                value={adicionais.valorDiarioVT}
                onChange={(e) => onChange("valorDiarioVT", e.target.value)}
                className="juriscalc-input" 
                type="number"
                min="0"
                step="0.01"
                placeholder="Valor diário do VT"
              />
            </div>
            <div>
              <Label htmlFor="diasValeTransporte" className="juriscalc-label">Dias Não Pagos</Label>
              <Input 
                id="diasValeTransporte" 
                value={adicionais.diasValeTransporte}
                onChange={(e) => onChange("diasValeTransporte", e.target.value)}
                className="juriscalc-input" 
                type="number"
                min="0"
                placeholder="22"
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Vale Alimentação */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="calcularValeAlimentacao" className="font-bold">
            Vale Alimentação Não Pago
          </Label>
          <Switch 
            id="calcularValeAlimentacao"
            checked={adicionais.calcularValeAlimentacao}
            onCheckedChange={(checked) => onChange("calcularValeAlimentacao", checked)}
          />
        </div>
        
        {adicionais.calcularValeAlimentacao && (
          <div className="pl-4 border-l-2 border-gray-200 space-y-3">
            <div>
              <Label htmlFor="valorDiarioVA" className="juriscalc-label">Valor Diário (R$)</Label>
              <Input 
                id="valorDiarioVA" 
                value={adicionais.valorDiarioVA}
                onChange={(e) => onChange("valorDiarioVA", e.target.value)}
                className="juriscalc-input" 
                type="number"
                min="0"
                step="0.01"
                placeholder="Valor diário do VA"
              />
            </div>
            <div>
              <Label htmlFor="diasValeAlimentacao" className="juriscalc-label">Dias Não Pagos</Label>
              <Input 
                id="diasValeAlimentacao" 
                value={adicionais.diasValeAlimentacao}
                onChange={(e) => onChange("diasValeAlimentacao", e.target.value)}
                className="juriscalc-input" 
                type="number"
                min="0"
                placeholder="22"
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Adicional de Transferência */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="calcularAdicionalTransferencia" className="font-bold">
            Adicional de Transferência
          </Label>
          <Switch 
            id="calcularAdicionalTransferencia"
            checked={adicionais.calcularAdicionalTransferencia}
            onCheckedChange={(checked) => onChange("calcularAdicionalTransferencia", checked)}
          />
        </div>
        
        {adicionais.calcularAdicionalTransferencia && (
          <div className="pl-4 border-l-2 border-gray-200 space-y-3">
            <div>
              <Label htmlFor="percentualAdicionalTransferencia" className="juriscalc-label">Percentual (%)</Label>
              <Input 
                id="percentualAdicionalTransferencia" 
                value={adicionais.percentualAdicionalTransferencia}
                onChange={(e) => onChange("percentualAdicionalTransferencia", e.target.value)}
                className="juriscalc-input" 
                type="number"
                min="0"
                max="100"
                placeholder="25"
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Descontos Indevidos */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="calcularDescontosIndevidos" className="font-bold">
            Descontos Indevidos
          </Label>
          <Switch 
            id="calcularDescontosIndevidos"
            checked={adicionais.calcularDescontosIndevidos}
            onCheckedChange={(checked) => onChange("calcularDescontosIndevidos", checked)}
          />
        </div>
        
        {adicionais.calcularDescontosIndevidos && (
          <div className="pl-4 border-l-2 border-gray-200 space-y-3">
            <div>
              <Label htmlFor="valorDescontosIndevidos" className="juriscalc-label">Valor Total dos Descontos (R$)</Label>
              <Input 
                id="valorDescontosIndevidos" 
                value={adicionais.valorDescontosIndevidos}
                onChange={(e) => onChange("valorDescontosIndevidos", e.target.value)}
                className="juriscalc-input" 
                type="number"
                min="0"
                step="0.01"
                placeholder="Valor total dos descontos indevidos"
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Diferenças Salariais */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="calcularDiferencasSalariais" className="font-bold">
            Diferenças Salariais
          </Label>
          <Switch 
            id="calcularDiferencasSalariais"
            checked={adicionais.calcularDiferencasSalariais}
            onCheckedChange={(checked) => onChange("calcularDiferencasSalariais", checked)}
          />
        </div>
        
        {adicionais.calcularDiferencasSalariais && (
          <div className="pl-4 border-l-2 border-gray-200 space-y-3">
            <div>
              <Label htmlFor="valorDiferencasSalariais" className="juriscalc-label">Valor Total das Diferenças (R$)</Label>
              <Input 
                id="valorDiferencasSalariais" 
                value={adicionais.valorDiferencasSalariais}
                onChange={(e) => onChange("valorDiferencasSalariais", e.target.value)}
                className="juriscalc-input" 
                type="number"
                min="0"
                step="0.01"
                placeholder="Valor total das diferenças salariais"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
