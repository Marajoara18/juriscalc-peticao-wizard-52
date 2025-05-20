import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { CalculoSalvo } from '@/types/calculoSalvo';

// Constante para limitar o número de cálculos salvos (para todos os usuários)
const LIMITE_CALCULOS_SALVOS = 3;

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
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [selectedCalculoForVerify, setSelectedCalculoForVerify] = useState<CalculoSalvo | null>(null);

  // Função para carregar cálculos salvos do localStorage
  const carregarCalculosSalvos = () => {
    console.log('Carregando cálculos salvos do localStorage');
    const salvos = localStorage.getItem('calculosSalvos');
    if (salvos) {
      try {
        const parsedSalvos = JSON.parse(salvos);
        console.log('Cálculos carregados:', parsedSalvos.length);
        setCalculosSalvos(parsedSalvos);
      } catch (error) {
        console.error('Erro ao carregar cálculos salvos:', error);
      }
    } else {
      console.log('Nenhum cálculo salvo encontrado no localStorage');
    }
  };

  // Função para exportar que permite recarregar os cálculos sob demanda
  const recarregarCalculosSalvos = () => {
    carregarCalculosSalvos();
  };

  // Carregar cálculos salvos quando o componente é montado
  useEffect(() => {
    console.log('useCalculosSalvos - Efeito de montagem');
    carregarCalculosSalvos();
    
    // Adicionar um event listener para atualizar os cálculos salvos quando o localStorage mudar
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'calculosSalvos') {
        console.log('Evento storage: calculosSalvos alterado');
        carregarCalculosSalvos();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Criar um intervalo para verificar periodicamente se há novos cálculos
    const intervalId = setInterval(carregarCalculosSalvos, 2000);
    
    // Limpar o event listener e o intervalo quando o componente desmontar
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  // Adicionar um efeito para detectar eventos personalizados de atualização
  useEffect(() => {
    const handleCustomEvent = () => {
      console.log('Evento customizado: calculosSalvosUpdated');
      carregarCalculosSalvos();
    };

    window.addEventListener('calculosSalvosUpdated', handleCustomEvent);
    
    return () => {
      window.removeEventListener('calculosSalvosUpdated', handleCustomEvent);
    };
  }, []);

  const salvarCalculos = () => {
    if (resultados.verbasRescisorias.total === 0 && Object.values(resultados.adicionais).every(valor => valor === 0)) {
      toast.error('Não há cálculos para salvar. Faça um cálculo primeiro.');
      return;
    }
    
    // Verificar se o usuário já atingiu o limite de cálculos salvos
    // Este limite se aplica a todos os usuários, premium ou não
    const userId = localStorage.getItem('userId') || 'anonymous';
    const calculosDoUsuario = calculosSalvos.filter(c => c.userId === userId);
    
    if (calculosDoUsuario.length >= LIMITE_CALCULOS_SALVOS && !editandoId) {
      toast.error(`Você atingiu o limite de ${LIMITE_CALCULOS_SALVOS} cálculos salvos. Apague algum cálculo para adicionar um novo.`);
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

    const userId = localStorage.getItem('userId') || 'anonymous';
    const calculosDoUsuario = calculosSalvos.filter(c => c.userId === userId);
    
    // Verificar novamente o limite (para caso de edições concorrentes)
    // Este limite se aplica a todos os usuários, premium ou não
    if (calculosDoUsuario.length >= LIMITE_CALCULOS_SALVOS && !editandoId) {
      toast.error(`Você atingiu o limite de ${LIMITE_CALCULOS_SALVOS} cálculos salvos. Apague algum cálculo para adicionar um novo.`);
      setDialogOpen(false);
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
    
    // Disparar um evento customizado para notificar outros componentes
    window.dispatchEvent(new Event('calculosSalvosUpdated'));
    
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
    
    // Disparar um evento customizado para notificar outros componentes
    window.dispatchEvent(new Event('calculosSalvosUpdated'));
    
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

  const handleVerifyCalculo = (calculo: CalculoSalvo) => {
    setSelectedCalculoForVerify(calculo);
    setVerifyDialogOpen(true);
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
    verifyDialogOpen,
    selectedCalculoForPeticao,
    selectedCalculoForPreview,
    selectedCalculoForVerify,
    salvarCalculos,
    handleSalvar,
    handleEditar,
    handleReabrirCalculo,
    handleApagar,
    handleUsarCalculo,
    handlePreviewCalculo,
    handleVerifyCalculo,
    handleUsarNaPeticao,
    confirmarUsarNaPeticao,
    setDialogOpen,
    setNomeCalculo,
    setConfirmDialogOpen,
    setPreviewDialogOpen,
    setVerifyDialogOpen,
    recarregarCalculosSalvos, // Exportando a função para recarregar cálculos
  };
};

export default useCalculosSalvos;
