
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PeticaoFormData } from '@/types/peticao';
import { Plus, Trash } from 'lucide-react';

interface CalculosAdicionaisProps {
  formData: PeticaoFormData;
  onCheckboxChange: (field: string) => void;
  onCustomCalcChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number) => void;
  toggleCustomCalc: () => void;
  addCustomCalc?: () => void;
  removeCustomCalc?: (index: number) => void;
}

const CalculosAdicionais: React.FC<CalculosAdicionaisProps> = ({ 
  formData, 
  onCheckboxChange, 
  onCustomCalcChange, 
  toggleCustomCalc,
  addCustomCalc,
  removeCustomCalc
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
          <h4 className="font-medium">Cálculos Adicionais Personalizados</h4>
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="customCalc" 
              checked={formData.calculosAdicionais.custom.enabled}
              onChange={toggleCustomCalc}
              className="rounded border-gray-300 text-juriscalc-navy focus:ring-juriscalc-navy"
            />
            <label htmlFor="customCalc" className="text-sm">Adicionar cálculos personalizados</label>
          </div>
        </div>
        
        {formData.calculosAdicionais.custom.enabled && (
          <div className="space-y-4 pl-4 border-l-2 border-gray-200">
            {formData.calculosAdicionais.custom.items && formData.calculosAdicionais.custom.items.map((item, index) => (
              <div key={index} className="space-y-3 border-b border-gray-200 pb-3 last:border-0">
                <div className="flex justify-between items-center">
                  <h5 className="text-sm font-medium">Cálculo Personalizado {index + 1}</h5>
                  {removeCustomCalc && (
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeCustomCalc(index)}
                      className="text-red-500 hover:text-red-700 p-1 h-auto"
                    >
                      <Trash size={16} />
                    </Button>
                  )}
                </div>
                
                <div>
                  <label htmlFor={`descricao-${index}`} className="block text-sm font-medium mb-1">Descrição do Cálculo</label>
                  <Input
                    id={`descricao-${index}`}
                    name="descricao"
                    type="text"
                    className="w-full"
                    value={item.descricao}
                    onChange={(e) => onCustomCalcChange(e, index)}
                  />
                </div>
                <div>
                  <label htmlFor={`formula-${index}`} className="block text-sm font-medium mb-1">Valor ou Fórmula</label>
                  <Input
                    id={`formula-${index}`}
                    name="formula"
                    type="text"
                    className="w-full"
                    value={item.formula}
                    onChange={(e) => onCustomCalcChange(e, index)}
                  />
                </div>
              </div>
            ))}
            
            {addCustomCalc && (
              <Button 
                type="button"
                variant="outline" 
                size="sm" 
                onClick={addCustomCalc}
                className="w-full flex items-center justify-center gap-1 mt-2"
              >
                <Plus size={16} />
                Adicionar Novo Cálculo
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculosAdicionais;
