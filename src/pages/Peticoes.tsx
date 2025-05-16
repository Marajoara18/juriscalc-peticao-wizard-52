import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Plus, ArrowLeft, LogOut, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Mock data for petições modelo
const peticoesModelo = [
  { 
    id: 1, 
    titulo: 'Reclamação Trabalhista - Verbas Rescisórias', 
    descricao: 'Modelo padrão para ação de reclamação de verbas rescisórias não pagas',
    categoria: 'verbas'
  },
  { 
    id: 2, 
    titulo: 'Reclamação Trabalhista - Horas Extras', 
    descricao: 'Modelo para reclamação de horas extras não pagas',
    categoria: 'horas'
  },
  { 
    id: 3, 
    titulo: 'Pedido de Adicional de Insalubridade', 
    descricao: 'Modelo para pedido de adicional de insalubridade',
    categoria: 'adicionais'
  },
  { 
    id: 4, 
    titulo: 'Pedido de Adicional de Periculosidade', 
    descricao: 'Modelo para pedido de adicional de periculosidade',
    categoria: 'adicionais'
  },
  { 
    id: 5, 
    titulo: 'Reclamação por Assédio Moral', 
    descricao: 'Modelo para pedido de indenização por assédio moral',
    categoria: 'danos'
  },
  { 
    id: 6, 
    titulo: 'Rescisão Indireta', 
    descricao: 'Modelo para pedido de rescisão indireta do contrato de trabalho',
    categoria: 'verbas'
  }
];

// Inicialização do localStorage para usuários que acessam pela primeira vez
const initializeLocalStorage = () => {
  if (!localStorage.getItem('peticoesRecentes')) {
    localStorage.setItem('peticoesRecentes', JSON.stringify([]));
  }
  if (!localStorage.getItem('peticoesCount')) {
    localStorage.setItem('peticoesCount', '0');
  }
  if (!localStorage.getItem('userPremium')) {
    localStorage.setItem('userPremium', 'false');
  }
};

const ModeloCard = ({ modelo, onUseModelo }: { modelo: typeof peticoesModelo[0], onUseModelo: (id: number) => void }) => {
  return (
    <Card className="cursor-pointer hover:border-juriscalc-navy transition-all">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-serif">{modelo.titulo}</CardTitle>
            <CardDescription className="mt-1 line-clamp-2">{modelo.descricao}</CardDescription>
          </div>
          <div className="w-10 h-10 rounded-full bg-juriscalc-navy/10 flex items-center justify-center shrink-0">
            <FileText size={18} className="text-juriscalc-navy" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button 
          size="sm" 
          className="w-full bg-juriscalc-navy hover:bg-opacity-90" 
          onClick={() => onUseModelo(modelo.id)}
        >
          Usar Modelo
        </Button>
      </CardContent>
    </Card>
  );
};

const PeticaoRecenteCard = ({ peticao, onEditPeticao }: { peticao: any, onEditPeticao: (id: number) => void }) => {
  return (
    <Card className="cursor-pointer hover:border-juriscalc-navy transition-all">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-serif">{peticao.titulo}</CardTitle>
            <CardDescription className="mt-1">{peticao.descricao}</CardDescription>
          </div>
          <div className={`px-2 py-1 rounded text-xs font-medium ${
            peticao.status === 'finalizada' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-amber-100 text-amber-800'
          }`}>
            {peticao.status === 'finalizada' ? 'Finalizada' : 'Rascunho'}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Criada em {peticao.data}
          </div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onEditPeticao(peticao.id)}
          >
            Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const EditorPeticao = ({ 
  modelo, 
  peticao, 
  onVoltar,
  onSave 
}: { 
  modelo?: typeof peticoesModelo[0], 
  peticao?: any,
  onVoltar: () => void,
  onSave: (data: any) => void
}) => {
  const [formData, setFormData] = useState({
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

const Peticoes = () => {
  const navigate = useNavigate();
  const [selectedModeloId, setSelectedModeloId] = useState<number | null>(null);
  const [selectedPeticaoId, setSelectedPeticaoId] = useState<number | null>(null);
  const [view, setView] = useState<'list' | 'editor' | 'new'>('list');
  const [peticoesRecentes, setPeticoesRecentes] = useState<any[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  
  // Carrega dados do localStorage
  useEffect(() => {
    initializeLocalStorage();
    const storedPeticoes = localStorage.getItem('peticoesRecentes');
    if (storedPeticoes) {
      setPeticoesRecentes(JSON.parse(storedPeticoes));
    }
    
    const userPremium = localStorage.getItem('userPremium') === 'true';
    setIsPremium(userPremium);
  }, []);
  
  const selectedModelo = peticoesModelo.find(m => m.id === selectedModeloId);
  const selectedPeticao = peticoesRecentes.find(p => p.id === selectedPeticaoId);
  
  const handleNovaPeticao = () => {
    // Verificar limite de petições para usuários gratuitos
    if (!isPremium) {
      const count = parseInt(localStorage.getItem('peticoesCount') || '0');
      if (count >= 3) {
        toast.error('Você atingiu o limite de 3 petições gratuitas. Assine o plano premium para continuar.');
        return;
      }
    }
    
    setView('new');
    setSelectedModeloId(null);
    setSelectedPeticaoId(null);
  };
  
  const handleUseModelo = (id: number) => {
    // Verificar limite de petições para usuários gratuitos
    if (!isPremium) {
      const count = parseInt(localStorage.getItem('peticoesCount') || '0');
      if (count >= 3) {
        toast.error('Você atingiu o limite de 3 petições gratuitas. Assine o plano premium para continuar.');
        return;
      }
    }
    
    setSelectedModeloId(id);
    setView('editor');
    toast.info('Modelo selecionado! Preencha os dados necessários.');
  };
  
  const handleEditPeticao = (id: number) => {
    setSelectedPeticaoId(id);
    setView('editor');
  };
  
  const handleVoltar = () => {
    setView('list');
    setSelectedModeloId(null);
    setSelectedPeticaoId(null);
  };

  const handleSavePeticao = (data: any) => {
    let updatedPeticoes = [...peticoesRecentes];
    const existingIndex = updatedPeticoes.findIndex(p => p.id === data.id);
    
    if (existingIndex >= 0) {
      // Atualiza petição existente
      updatedPeticoes[existingIndex] = data;
    } else {
      // Adiciona nova petição
      updatedPeticoes.unshift(data);
      
      // Incrementa contador para usuários não premium
      if (!isPremium) {
        const count = parseInt(localStorage.getItem('peticoesCount') || '0');
        localStorage.setItem('peticoesCount', String(count + 1));
      }
    }
    
    setPeticoesRecentes(updatedPeticoes);
    localStorage.setItem('peticoesRecentes', JSON.stringify(updatedPeticoes));
    
    toast.success(`Petição ${data.status === 'finalizada' ? 'finalizada' : 'salva como rascunho'} com sucesso!`);
    handleVoltar();
  };

  const handleLogout = () => {
    // Implementação simples de logout
    localStorage.removeItem('userPremium');
    localStorage.setItem('peticoesCount', '0');
    toast.success('Logout realizado com sucesso!');
    navigate('/');
  };

  if (view === 'editor' || view === 'new') {
    return (
      <Layout>
        <div className="container mx-auto py-10 px-4">
          <EditorPeticao 
            modelo={selectedModelo} 
            peticao={selectedPeticao}
            onVoltar={handleVoltar}
            onSave={handleSavePeticao}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-juriscalc-navy">Petições</h1>
          <div className="flex space-x-3">
            <Button 
              className="bg-juriscalc-gold text-juriscalc-navy hover:bg-opacity-90"
              onClick={handleNovaPeticao}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Petição
            </Button>
            <Button 
              variant="outline" 
              className="border-juriscalc-navy text-juriscalc-navy"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>

        {!isPremium && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Você está utilizando a versão gratuita. Limite de 3 petições. 
                  <Button 
                    variant="link" 
                    className="ml-1 p-0 text-yellow-700 font-medium underline"
                    onClick={() => toast.info('Em breve: Página de assinatura do plano premium!')}
                  >
                    Assine o plano premium
                  </Button>
                </p>
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue="recentes" className="mb-8">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="recentes" className="flex-1">Petições Recentes</TabsTrigger>
            <TabsTrigger value="modelos" className="flex-1">Modelos de Petição</TabsTrigger>
          </TabsList>

          <TabsContent value="recentes">
            {peticoesRecentes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {peticoesRecentes.map((peticao) => (
                  <PeticaoRecenteCard 
                    key={peticao.id} 
                    peticao={peticao} 
                    onEditPeticao={handleEditPeticao}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-serif font-bold mb-2">Nenhuma petição recente</h3>
                <p className="text-gray-500">Crie uma nova petição para começar</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="modelos">
            <div className="mb-6">
              <h2 className="text-xl font-serif font-semibold mb-4 text-juriscalc-navy">Modelos Disponíveis</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {peticoesModelo.map((modelo) => (
                  <ModeloCard 
                    key={modelo.id} 
                    modelo={modelo} 
                    onUseModelo={handleUseModelo}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-juriscalc-lightgray rounded-lg p-6 mt-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-serif font-bold mb-2 text-juriscalc-navy">Precisando de ajuda?</h3>
              <p className="text-juriscalc-darkgray mb-2">
                Em caso de dúvidas, entre em contato: <a href="mailto:johnnyrnsantos@gmail.com" className="text-juriscalc-navy underline">johnnyrnsantos@gmail.com</a>
              </p>
            </div>
            <Button 
              variant="outline" 
              className="border-juriscalc-navy text-juriscalc-navy"
              onClick={() => window.print()}
            >
              Imprimir Petição
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Peticoes;
