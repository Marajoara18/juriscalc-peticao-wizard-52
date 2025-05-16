import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, FileText } from 'lucide-react';
import { toast } from "sonner";
import TabelaCalculos from './TabelaCalculos';

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
  calculosTabela?: any;
  htmlCalculos?: string; // Campo para armazenar o HTML da tabela de cálculos
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
    },
    calculosTabela: peticao?.calculosTabela || null,
    htmlCalculos: peticao?.htmlCalculos || null
  });
  
  const [calculosImportados, setCalculosImportados] = useState<any>(null);
  const [calculosPreview, setCalculosPreview] = useState<string | null>(null);
  
  // Carregar cálculos do localStorage quando o componente for montado
  useEffect(() => {
    const calculosArmazenados = localStorage.getItem('calculosParaPeticao');
    if (calculosArmazenados) {
      try {
        setCalculosImportados(JSON.parse(calculosArmazenados));
      } catch (error) {
        console.error('Erro ao carregar cálculos:', error);
      }
    }
  }, []);

  // Efeito para renderizar o preview dos cálculos quando eles já estiverem na petição
  useEffect(() => {
    if (formData.calculosTabela) {
      setCalculosPreview("com_calculos");
    }
  }, [formData.calculosTabela]);

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
  
  // Função para gerar o HTML dos cálculos para incorporar na petição
  const gerarHTMLCalculos = () => {
    const tempDiv = document.createElement('div');
    const calculosParaInserir = calculosImportados;
    
    // Criar o componente TabelaCalculos temporariamente para capturar o HTML
    const root = document.createElement('div');
    root.id = 'temp-root';
    document.body.appendChild(root);
    
    try {
      // Renderiza a tabela de cálculos no elemento temporário
      const tempElement = document.getElementById('temp-root');
      if (tempElement) {
        tempElement.innerHTML = '';
        tempElement.style.display = 'none';
        
        // Criar manualmente o HTML da tabela com base nos dados
        const html = criarHTMLCalculosEmbutidos(calculosParaInserir);
        
        return html;
      }
      return null;
    } catch (error) {
      console.error('Erro ao gerar HTML dos cálculos:', error);
      return null;
    } finally {
      // Limpar o elemento temporário
      const tempElement = document.getElementById('temp-root');
      if (tempElement) {
        document.body.removeChild(tempElement);
      }
    }
  };
  
  // Função auxiliar para criar HTML dos cálculos
  const criarHTMLCalculosEmbutidos = (calculos: any) => {
    if (!calculos) return '';
    
    // Renderer para o componente
    const renderComponentHTML = () => {
      return `
        <div class="petitio-calculos my-6">
          <!-- Renderizamos aqui o componente TabelaCalculos, mas com estilo embutido -->
        </div>
      `;
    };
    
    return renderComponentHTML();
  };
  
  // Função para inserir a tabela de cálculos na petição
  const handleInserirCalculos = () => {
    if (!calculosImportados) return;
    
    // Salvando os cálculos nos dados da petição
    setFormData(prev => ({
      ...prev,
      calculosTabela: calculosImportados
    }));
    
    // Inserir texto indicativo no final da descrição
    const textoCalculos = "\n\nOS VALORES DEVIDOS AO RECLAMANTE SOMAM " + 
      "R$ " + calculosImportados.totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + 
      " (" + valorPorExtenso(calculosImportados.totalGeral) + "), conforme demonstrativo ABAIXO.";
    
    setFormData(prev => ({
      ...prev,
      descricao: prev.descricao + textoCalculos
    }));
    
    // Definir o preview dos cálculos para mostrar na interface
    setCalculosPreview("com_calculos");
    
    toast.success('Cálculos inseridos na petição com sucesso!');
    
    // Limpar do localStorage após usar
    localStorage.removeItem('calculosParaPeticao');
    setCalculosImportados(null);
  };
  
  // Função para converter valor numérico para texto por extenso
  const valorPorExtenso = (valor: number): string => {
    if (valor === 0) return "zero reais";
    
    const unidades = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"];
    const dezADezenove = ["dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
    const dezenas = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
    const centenas = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];
    
    const valorInteiro = Math.floor(valor);
    const centavos = Math.round((valor - valorInteiro) * 100);
    
    let extenso = "";
    
    // Processando a parte inteira
    if (valorInteiro > 0) {
      if (valorInteiro === 1) {
        extenso = "um real";
      } else {
        // Processamento para milhões
        const milhoes = Math.floor(valorInteiro / 1000000);
        if (milhoes > 0) {
          if (milhoes === 1) {
            extenso += "um milhão";
          } else {
            extenso += converterNumero(milhoes) + " milhões";
          }
          if (valorInteiro % 1000000 !== 0) extenso += " e ";
        }
        
        // Processamento para milhares
        const restoDivisaoMilhoes = valorInteiro % 1000000;
        const milhares = Math.floor(restoDivisaoMilhoes / 1000);
        if (milhares > 0) {
          if (milhares === 1) {
            extenso += "mil";
          } else {
            extenso += converterNumero(milhares) + " mil";
          }
          if (valorInteiro % 1000 !== 0) extenso += " e ";
        }
        
        // Processamento para unidades
        const resto = valorInteiro % 1000;
        if (resto > 0) {
          extenso += converterNumero(resto);
        }
        
        extenso += " reais";
      }
    }
    
    // Processando os centavos
    if (centavos > 0) {
      if (extenso !== "") {
        extenso += " e ";
      }
      
      if (centavos === 1) {
        extenso += "um centavo";
      } else {
        extenso += converterNumero(centavos) + " centavos";
      }
    }
    
    return extenso;
    
    // Função auxiliar para converter números menores
    function converterNumero(num: number): string {
      if (num < 10) return unidades[num];
      if (num < 20) return dezADezenove[num - 10];
      if (num < 100) {
        const dezena = Math.floor(num / 10);
        const unidade = num % 10;
        return dezenas[dezena] + (unidade > 0 ? " e " + unidades[unidade] : "");
      }
      if (num < 1000) {
        const centena = Math.floor(num / 100);
        const resto = num % 100;
        
        // Caso especial para 100
        if (centena === 1 && resto === 0) return "cem";
        
        return centenas[centena] + (resto > 0 ? " e " + converterNumero(resto) : "");
      }
      return "";
    }
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

  // Renderiza o preview da tabela de cálculos embutida na petição
  const renderCalculosPreview = () => {
    if (!formData.calculosTabela) return null;
    
    return (
      <div className="mt-6 border-t-2 border-dashed border-gray-300 pt-6">
        <TabelaCalculos 
          calculos={formData.calculosTabela}
          onInserirNoPeticao={() => {}}
          embutido={true}
        />
      </div>
    );
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

      {/* Exibir cálculos importados se existirem */}
      {calculosImportados && (
        <TabelaCalculos 
          calculos={calculosImportados} 
          onInserirNoPeticao={handleInserirCalculos}
        />
      )}
      
      {/* Exibir resumo dos cálculos salvos com a petição se existirem */}
      {!calculosImportados && formData.calculosTabela && !calculosPreview && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Cálculos Inseridos na Petição
            </CardTitle>
            <CardDescription>
              Os cálculos abaixo foram incluídos nesta petição
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-3 rounded-md text-center">
              <p className="font-medium">Valor Total: {formData.calculosTabela.totalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              <p className="text-sm text-gray-500">Os valores detalhados estão inclusos no documento da petição</p>
            </div>
          </CardContent>
        </Card>
      )}
      
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

            {/* Mostrar os cálculos embutidos na petição */}
            {formData.calculosTabela && (
              <div className="border-2 border-gray-200 rounded-md p-4">
                <h3 className="text-lg font-medium mb-3 text-juriscalc-navy">Preview da Petição com Cálculos</h3>
                <div className="p-4 bg-white border rounded-md max-h-[400px] overflow-y-auto">
                  <div className="whitespace-pre-wrap mb-6">{formData.descricao}</div>
                  {renderCalculosPreview()}
                </div>
              </div>
            )}

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
