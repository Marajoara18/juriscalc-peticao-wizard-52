
import React from 'react';
import { Input } from '@/components/ui/input';
import { PeticaoFormData } from '@/types/peticao';

interface CalculosAdicionaisProps {
  formData: PeticaoFormData;
  onCheckboxChange: (field: string) => void;
  onCustomCalcChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  toggleCustomCalc: () => void;
}

const CalculosAdicionais: React.FC<CalculosAdicionaisProps> = ({ 
  formData, 
  onCheckboxChange, 
  onCustomCalcChange, 
  toggleCustomCalc 
}) => {
  return (
    <div className="pt-4 border-t border-gray-200 print:hidden">
      <h3 className="font-medium text-lg mb-3">Cálculos Adicionais</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="feriasVencidas" 
            checked={formData.calculosAdicionais.feriasVencidas}
            onChange={() => onCheckboxChange('feriasVencidas')}
            className="rounded border-gray-300 text-juriscalc-navy focus:ring-juriscalc-navy"
          />
          <label htmlFor="feriasVencidas" className="text-sm">Férias vencidas (+ 1/3)</label>
        </div>
        
        <div className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="indenizacaoDemissao" 
            checked={formData.calculosAdicionais.indenizacaoDemissao}
            onChange={() => onCheckboxChange('indenizacaoDemissao')}
            className="rounded border-gray-300 text-juriscalc-navy focus:ring-juriscalc-navy"
          />
          <label htmlFor="indenizacaoDemissao" className="text-sm">Indenização por demissão sem justa causa</label>
        </div>
        
        <div className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="valeTransporte" 
            checked={formData.calculosAdicionais.valeTransporte}
            onChange={() => onCheckboxChange('valeTransporte')}
            className="rounded border-gray-300 text-juriscalc-navy focus:ring-juriscalc-navy"
          />
          <label htmlFor="valeTransporte" className="text-sm">Vale transporte não pago</label>
        </div>
        
        <div className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="valeAlimentacao" 
            checked={formData.calculosAdicionais.valeAlimentacao}
            onChange={() => onCheckboxChange('valeAlimentacao')}
            className="rounded border-gray-300 text-juriscalc-navy focus:ring-juriscalc-navy"
          />
          <label htmlFor="valeAlimentacao" className="text-sm">Vale alimentação não pago</label>
        </div>
        
        <div className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="adicionalTransferencia" 
            checked={formData.calculosAdicionais.adicionalTransferencia}
            onChange={() => onCheckboxChange('adicionalTransferencia')}
            className="rounded border-gray-300 text-juriscalc-navy focus:ring-juriscalc-navy"
          />
          <label htmlFor="adicionalTransferencia" className="text-sm">Adicional de transferência</label>
        </div>
        
        <div className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="descontosIndevidos" 
            checked={formData.calculosAdicionais.descontosIndevidos}
            onChange={() => onCheckboxChange('descontosIndevidos')}
            className="rounded border-gray-300 text-juriscalc-navy focus:ring-juriscalc-navy"
          />
          <label htmlFor="descontosIndevidos" className="text-sm">Descontos indevidos</label>
        </div>
        
        <div className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="diferencasSalariais" 
            checked={formData.calculosAdicionais.diferencasSalariais}
            onChange={() => onCheckboxChange('diferencasSalariais')}
            className="rounded border-gray-300 text-juriscalc-navy focus:ring-juriscalc-navy"
          />
          <label htmlFor="diferencasSalariais" className="text-sm">Diferenças salariais</label>
        </div>
        
        <div className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="salarioFamilia" 
            checked={formData.calculosAdicionais.salarioFamilia || false}
            onChange={() => onCheckboxChange('salarioFamilia')}
            className="rounded border-gray-300 text-juriscalc-navy focus:ring-juriscalc-navy"
          />
          <label htmlFor="salarioFamilia" className="text-sm">Salário-Família</label>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center space-x-3 mb-3">
          <h4 className="font-medium">Cálculo Adicional Personalizado</h4>
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="customCalc" 
              checked={formData.calculosAdicionais.custom.enabled}
              onChange={toggleCustomCalc}
              className="rounded border-gray-300 text-juriscalc-navy focus:ring-juriscalc-navy"
            />
            <label htmlFor="customCalc" className="text-sm">Adicionar cálculo personalizado</label>
          </div>
        </div>
        
        {formData.calculosAdicionais.custom.enabled && (
          <div className="space-y-3 pl-4 border-l-2 border-gray-200">
            <div>
              <label htmlFor="descricao" className="block text-sm font-medium mb-1">Descrição do Cálculo</label>
              <Input
                id="descricao"
                name="descricao"
                type="text"
                className="w-full"
                value={formData.calculosAdicionais.custom.descricao}
                onChange={onCustomCalcChange}
              />
            </div>
            <div>
              <label htmlFor="formula" className="block text-sm font-medium mb-1">Valor ou Fórmula</label>
              <Input
                id="formula"
                name="formula"
                type="text"
                className="w-full"
                value={formData.calculosAdicionais.custom.formula}
                onChange={onCustomCalcChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculosAdicionais;
