
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { CalculoSalvo } from '@/types/calculoSalvo';

export const useCalculosSalvos = (
  resultados: any, 
  totalGeral: number, 
  dadosContrato: any, 
  onLoadCalculo: (calculo: CalculoSalvo) => void
) => {
  const navigate = useNavigate();
  const [calculosSalvos, setCalculosSalvos] = useState<CalculoSalvo[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nomeCalculo, setNomeCalculo] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedCalculoForPeticao, setSelectedCalculoForPeticao] = useState<CalculoSalvo | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedCalculoForPreview, setSelectedCalculoForPreview] = useState<CalculoSalvo | null>(null);

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
      nomeEscritorio,
      dadosContrato: {
        dataAdmissao: dadosContrato.dataAdmissao,
        dataDemissao: dadosContrato.dataDemissao,
        salarioBase: dadosContrato.salarioBase,
        tipoRescisao: dadosContrato.tipoRescisao,
        diasTrabalhados: dadosContrato.diasTrabalhados,
        mesesTrabalhados: dadosContrato.mesesTrabalhados,
      }
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

  const handleReabrirCalculo = (calculo: CalculoSalvo) => {
    onLoadCalculo(calculo);
    toast.success(`Cálculo "${calculo.nome}" reaberto para edição!`);
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

  const handlePreviewCalculo = (calculo: CalculoSalvo) => {
    setSelectedCalculoForPreview(calculo);
    setPreviewDialogOpen(true);
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

  return {
    calculosFiltrados,
    dialogOpen,
    nomeCalculo,
    confirmDialogOpen,
    previewDialogOpen,
    selectedCalculoForPeticao,
    selectedCalculoForPreview,
    salvarCalculos,
    handleSalvar,
    handleEditar,
    handleReabrirCalculo,
    handleApagar,
    handleUsarCalculo,
    handlePreviewCalculo,
    handleUsarNaPeticao,
    confirmarUsarNaPeticao,
    setDialogOpen,
    setNomeCalculo,
    setConfirmDialogOpen,
    setPreviewDialogOpen,
  };
};

export default useCalculosSalvos;
