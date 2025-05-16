
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Save, Trash, Edit, FileText } from "lucide-react";
import { toast } from "sonner";
import { formatarMoeda } from '@/utils/formatters';
import { useNavigate } from 'react-router-dom';

interface CalculoSalvo {
  id: string;
  nome: string;
  timestamp: string;
  verbasRescisorias: any;
  adicionais: any;
  totalGeral: number;
  userId?: string;
  nomeEscritorio?: string;
}

interface CalculosSalvosProps {
  resultados: any;
  totalGeral: number;
  onLoadCalculo: (calculo: CalculoSalvo) => void;
}

const CalculosSalvos: React.FC<CalculosSalvosProps> = ({ resultados, totalGeral, onLoadCalculo }) => {
  const navigate = useNavigate();
  const [calculosSalvos, setCalculosSalvos] = useState<CalculoSalvo[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nomeCalculo, setNomeCalculo] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedCalculoForPeticao, setSelectedCalculoForPeticao] = useState<CalculoSalvo | null>(null);

  // Carregar cálculos salvos
  useEffect(() => {
    const salvos = localStorage.getItem('calculosSalvos');
    if (salvos) {
      try {
        setCalculosSalvos(JSON.parse(salvos));
      } catch (error) {
        console.error('Erro ao carregar cálculos salvos:', error);
      }
    }
  }, []);

  const salvarCalculos = () => {
    if (resultados.verbasRescisorias.total === 0 && Object.values(resultados.adicionais).every(valor => valor === 0)) {
      toast.error('Não há cálculos para salvar. Faça um cálculo primeiro.');
      return;
    }
    
    setNomeCalculo('');
    setEditandoId(null);
    setDialogOpen(true);
  };

  const handleSalvar = () => {
    if (!nomeCalculo.trim()) {
      toast.error('Digite um nome para o cálculo');
      return;
    }

    const nomeEscritorio = localStorage.getItem('userName') || undefined;
    
    const novoCalculo: CalculoSalvo = {
      id: editandoId || Date.now().toString(),
      nome: nomeCalculo,
      timestamp: new Date().toISOString(),
      verbasRescisorias: resultados.verbasRescisorias,
      adicionais: resultados.adicionais,
      totalGeral: totalGeral,
      userId: localStorage.getItem('userId') || undefined,
      nomeEscritorio
    };

    let novosCalculos: CalculoSalvo[];
    
    if (editandoId) {
      novosCalculos = calculosSalvos.map(calc => 
        calc.id === editandoId ? novoCalculo : calc
      );
      toast.success('Cálculo atualizado com sucesso!');
    } else {
      novosCalculos = [novoCalculo, ...calculosSalvos];
      toast.success('Cálculo salvo com sucesso!');
    }
    
    setCalculosSalvos(novosCalculos);
    localStorage.setItem('calculosSalvos', JSON.stringify(novosCalculos));
    setDialogOpen(false);
  };

  const handleEditar = (calculo: CalculoSalvo) => {
    setNomeCalculo(calculo.nome);
    setEditandoId(calculo.id);
    setDialogOpen(true);
  };

  const handleApagar = (id: string) => {
    const novosCalculos = calculosSalvos.filter(calc => calc.id !== id);
    setCalculosSalvos(novosCalculos);
    localStorage.setItem('calculosSalvos', JSON.stringify(novosCalculos));
    toast.success('Cálculo removido com sucesso!');
  };

  const handleUsarCalculo = (calculo: CalculoSalvo) => {
    onLoadCalculo(calculo);
    toast.success(`Cálculo "${calculo.nome}" carregado com sucesso!`);
  };

  const handleUsarNaPeticao = (calculo: CalculoSalvo) => {
    setSelectedCalculoForPeticao(calculo);
    setConfirmDialogOpen(true);
  };

  const confirmarUsarNaPeticao = () => {
    if (selectedCalculoForPeticao) {
      localStorage.setItem('calculosParaPeticao', JSON.stringify({
        verbasRescisorias: selectedCalculoForPeticao.verbasRescisorias,
        adicionais: selectedCalculoForPeticao.adicionais,
        totalGeral: selectedCalculoForPeticao.totalGeral,
        timestamp: selectedCalculoForPeticao.timestamp,
        nome: selectedCalculoForPeticao.nome,
        nomeEscritorio: selectedCalculoForPeticao.nomeEscritorio || localStorage.getItem('userName')
      }));
      
      setConfirmDialogOpen(false);
      toast.success('Cálculo preparado para ser inserido na petição!');
      
      // Perguntar se deseja ir para a página de petições
      const confirmRedirect = window.confirm('Deseja ir para a página de petições agora?');
      if (confirmRedirect) {
        navigate('/peticoes');
      }
    }
  };

  // Filtrar cálculos do usuário atual
  const userId = localStorage.getItem('userId');
  const calculosFiltrados = userId 
    ? calculosSalvos.filter(calc => !calc.userId || calc.userId === userId)
    : calculosSalvos;

  return (
    <>
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Cálculos Salvos</span>
            <Button 
              onClick={salvarCalculos}
              variant="outline" 
              size="sm"
              className="border-juriscalc-navy text-juriscalc-navy"
            >
              <Save className="h-4 w-4 mr-1" />
              Salvar Atual
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {calculosFiltrados.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              Você não tem cálculos salvos ainda.
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {calculosFiltrados.map((calculo) => (
                <div 
                  key={calculo.id} 
                  className="border rounded-md p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                >
                  <div>
                    <h4 className="font-medium">{calculo.nome}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(calculo.timestamp).toLocaleDateString('pt-BR')} - 
                      {formatarMoeda(calculo.totalGeral)}
                    </p>
                  </div>
                  <div className="flex space-x-2 w-full sm:w-auto justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleUsarCalculo(calculo)}
                    >
                      Usar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleUsarNaPeticao(calculo)}
                      className="flex items-center gap-1"
                      title="Usar na Petição"
                    >
                      <FileText className="h-4 w-4" />
                      <span className="hidden sm:inline">Petição</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditar(calculo)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleApagar(calculo.id)}
                      className="text-red-500 hover:bg-red-50"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para salvar/editar cálculo */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editandoId ? 'Editar Cálculo' : 'Salvar Cálculo'}</DialogTitle>
            <DialogDescription>Dê um nome descritivo para identificar este cálculo posteriormente.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="block text-sm font-medium mb-2" htmlFor="nome-calculo">
              Nome do Cálculo
            </label>
            <Input 
              id="nome-calculo"
              value={nomeCalculo}
              onChange={(e) => setNomeCalculo(e.target.value)}
              placeholder="Ex: Cálculo Empresa XYZ"
              className="w-full"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvar}>
              {editandoId ? 'Atualizar' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação para usar na petição */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Usar Cálculo na Petição</DialogTitle>
            <DialogDescription>
              Este cálculo será disponibilizado para uso na próxima petição que você criar ou editar.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-2">
              <strong>Nome:</strong> {selectedCalculoForPeticao?.nome}
            </p>
            <p className="mb-4">
              <strong>Total:</strong> {selectedCalculoForPeticao ? formatarMoeda(selectedCalculoForPeticao.totalGeral) : ''}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmarUsarNaPeticao}>
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CalculosSalvos;
