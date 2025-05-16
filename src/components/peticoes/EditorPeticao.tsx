
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';

interface PeticaoFormData {
  id: number;
  titulo: string;
  descricao: string;
  reclamante: string;
  reclamado: string;
  status: string;
  data: string;
  calculosAdicionais: {
    feriasVencidas: boolean;
    indenizacaoDemissao: boolean;
    valeTransporte: boolean;
    valeAlimentacao: boolean;
    adicionalTransferencia: boolean;
    descontosIndevidos: boolean;
    diferencasSalariais: boolean;
    custom: {
      enabled: boolean;
      descricao: string;
      formula: string;
    };
  };
}

interface EditorPeticaoProps {
  modelo?: {
    id: number;
    titulo: string;
    descricao: string;
    categoria: string;
  };
  peticao?: any;
  onVoltar: () => void;
  onSave: (data: any) => void;
}

const EditorPeticao: React.FC<EditorPeticaoProps> = ({ 
  modelo, 
  peticao, 
  onVoltar, 
  onSave 
}) => {
  const [formData, setFormData] = useState<PeticaoFormData>({
    id: peticao?.id || Date.now(),
    titulo: peticao?.titulo || modelo?.titulo || '',
    descricao: peticao?.descricao || '',
    reclamante: peticao?.reclamante || '',
    reclamado: peticao?.reclamado || '',
    status: 'rascunho',
    data: new Date().toLocaleDateString('pt-BR'),
    calculosAdicionais: peticao?.calculosAdicionais || {
      feriasVencidas: false,
      indenizacaoDemissao: false,
      valeTransporte: false,
      valeAlimentacao: false,
      adicionalTransferencia: false,
      descontosIndevidos: false,
      diferencasSalariais: false,
      custom: {
        enabled: false,
        descricao: '',
        formula: ''
      }
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (field: string) => {
    setFormData(prev => ({
      ...prev,
      calculosAdicionais: {
        ...prev.calculosAdicionais,
        [field]: !prev.calculosAdicionais[field]
      }
    }));
  };

  const handleCustomCalcChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      calculosAdicionais: {
        ...prev.calculosAdicionais,
        custom: {
          ...prev.calculosAdicionais.custom,
          [name]: value
        }
      }
    }));
  };

  const toggleCustomCalc = () => {
    setFormData(prev => ({
      ...prev,
      calculosAdicionais: {
        ...prev.calculosAdicionais,
        custom: {
          ...prev.calculosAdicionais.custom,
          enabled: !prev.calculosAdicionais.custom.enabled
        }
      }
    }));
  };

  const handleSaveRascunho = () => {
    onSave({
      ...formData,
      status: 'rascunho'
    });
  };

  const handleSaveFinalized = () => {
    onSave({
      ...formData,
      status: 'finalizada'
    });
  };

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Button variant="ghost" onClick={onVoltar} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h2 className="text-2xl font-serif font-semibold">
          {modelo ? `Novo documento: ${modelo.titulo}` : `Editando: ${peticao?.titulo}`}
        </h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Dados do Processo</CardTitle>
          <CardDescription>Preencha as informações necessárias para a petição</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium mb-1">Título da Petição</label>
              <Input
                id="titulo"
                name="titulo"
                type="text"
                className="w-full"
                value={formData.titulo}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label htmlFor="reclamante" className="block text-sm font-medium mb-1">Nome do Reclamante</label>
              <Input
                id="reclamante"
                name="reclamante"
                type="text"
                className="w-full"
                value={formData.reclamante}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label htmlFor="reclamado" className="block text-sm font-medium mb-1">Nome do Reclamado (Empresa)</label>
              <Input
                id="reclamado"
                name="reclamado"
                type="text"
                className="w-full"
                value={formData.reclamado}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label htmlFor="descricao" className="block text-sm font-medium mb-1">Descrição dos Fatos</label>
              <Textarea
                id="descricao"
                name="descricao"
                className="w-full min-h-[150px]"
                value={formData.descricao}
                onChange={handleInputChange}
              />
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-medium text-lg mb-3">Cálculos Adicionais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="feriasVencidas" 
                    checked={formData.calculosAdicionais.feriasVencidas}
                    onChange={() => handleCheckboxChange('feriasVencidas')}
                    className="rounded border-gray-300 text-juriscalc-navy focus:ring-juriscalc-navy"
                  />
                  <label htmlFor="feriasVencidas" className="text-sm">Férias vencidas (+ 1/3)</label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="indenizacaoDemissao" 
                    checked={formData.calculosAdicionais.indenizacaoDemissao}
                    onChange={() => handleCheckboxChange('indenizacaoDemissao')}
                    className="rounded border-gray-300 text-juriscalc-navy focus:ring-juriscalc-navy"
                  />
                  <label htmlFor="indenizacaoDemissao" className="text-sm">Indenização por demissão sem justa causa</label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="valeTransporte" 
                    checked={formData.calculosAdicionais.valeTransporte}
                    onChange={() => handleCheckboxChange('valeTransporte')}
                    className="rounded border-gray-300 text-juriscalc-navy focus:ring-juriscalc-navy"
                  />
                  <label htmlFor="valeTransporte" className="text-sm">Vale transporte não pago</label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="valeAlimentacao" 
                    checked={formData.calculosAdicionais.valeAlimentacao}
                    onChange={() => handleCheckboxChange('valeAlimentacao')}
                    className="rounded border-gray-300 text-juriscalc-navy focus:ring-juriscalc-navy"
                  />
                  <label htmlFor="valeAlimentacao" className="text-sm">Vale alimentação não pago</label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="adicionalTransferencia" 
                    checked={formData.calculosAdicionais.adicionalTransferencia}
                    onChange={() => handleCheckboxChange('adicionalTransferencia')}
                    className="rounded border-gray-300 text-juriscalc-navy focus:ring-juriscalc-navy"
                  />
                  <label htmlFor="adicionalTransferencia" className="text-sm">Adicional de transferência</label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="descontosIndevidos" 
                    checked={formData.calculosAdicionais.descontosIndevidos}
                    onChange={() => handleCheckboxChange('descontosIndevidos')}
                    className="rounded border-gray-300 text-juriscalc-navy focus:ring-juriscalc-navy"
                  />
                  <label htmlFor="descontosIndevidos" className="text-sm">Descontos indevidos</label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="diferencasSalariais" 
                    checked={formData.calculosAdicionais.diferencasSalariais}
                    onChange={() => handleCheckboxChange('diferencasSalariais')}
                    className="rounded border-gray-300 text-juriscalc-navy focus:ring-juriscalc-navy"
                  />
                  <label htmlFor="diferencasSalariais" className="text-sm">Diferenças salariais</label>
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
                        onChange={handleCustomCalcChange}
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
                        onChange={handleCustomCalcChange}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="pt-4 flex justify-end space-x-4">
              <Button 
                variant="outline"
                onClick={handleSaveRascunho}
              >
                <Save className="mr-2 h-4 w-4" />
                Salvar Rascunho
              </Button>
              <Button 
                className="bg-juriscalc-navy" 
                onClick={handleSaveFinalized}
              >
                Finalizar Petição
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditorPeticao;
