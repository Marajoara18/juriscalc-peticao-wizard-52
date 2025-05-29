
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { CalculoSalvo } from '@/types/calculoSalvo';
import { useSupabaseCalculos } from './useSupabaseCalculos';
import { useSupabaseAuthOnly } from './auth/useSupabaseAuthOnly';
import { useSupabaseCalculationLimits } from './calculadora/useSupabaseCalculationLimits';

export const useCalculosSalvos = (
  resultados: any, 
  totalGeral: number, 
  dadosContrato: any, 
  onLoadCalculo: (calculo: CalculoSalvo) => void
) => {
  const navigate = useNavigate();
  const { user, profile } = useSupabaseAuthOnly();
  const { verificarLimiteSalvamento } = useSupabaseCalculationLimits();
  const { 
    calculosSalvos, 
    loading, 
    salvarCalculo, 
    atualizarCalculo, 
    excluirCalculo,
    recarregarCalculos
  } = useSupabaseCalculos();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [nomeCalculo, setNomeCalculo] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedCalculoForPeticao, setSelectedCalculoForPeticao] = useState<CalculoSalvo | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedCalculoForPreview, setSelectedCalculoForPreview] = useState<CalculoSalvo | null>(null);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [selectedCalculoForVerify, setSelectedCalculoForVerify] = useState<CalculoSalvo | null>(null);

  const salvarCalculos = () => {
    if (!user) {
      toast.error('Você precisa estar logado para salvar cálculos.');
      return;
    }

    if (resultados.verbasRescisorias.total === 0 && Object.values(resultados.adicionais).every(valor => valor === 0)) {
      toast.error('Não há cálculos para salvar. Faça um cálculo primeiro.');
      return;
    }
    
    // Verificar limite apenas se não estiver editando
    if (!editandoId && !verificarLimiteSalvamento()) {
      return;
    }
    
    setNomeCalculo('');
    setEditandoId(null);
    setDialogOpen(true);
  };

  const handleSalvar = async () => {
    if (!nomeCalculo.trim()) {
      toast.error('Digite um nome para o cálculo');
      return;
    }

    if (!user) {
      toast.error('Você precisa estar logado para salvar cálculos.');
      return;
    }

    // Verificar limite novamente antes de salvar (apenas se não estiver editando)
    if (!editandoId && !verificarLimiteSalvamento()) {
      setDialogOpen(false);
      return;
    }
    
    const nomeEscritorio = profile?.nome_completo || 'Usuário';
    
    if (editandoId) {
      // Atualizar cálculo existente
      await atualizarCalculo(editandoId, {
        nome: nomeCalculo,
        verbasRescisorias: resultados.verbasRescisorias,
        adicionais: resultados.adicionais,
        totalGeral: totalGeral,
        nomeEscritorio,
        dadosContrato: {
          dataAdmissao: dadosContrato.dataAdmissao,
          dataDemissao: dadosContrato.dataDemissao,
          salarioBase: dadosContrato.salarioBase,
          tipoRescisao: dadosContrato.tipoRescisao,
          diasTrabalhados: dadosContrato.diasTrabalhados,
          mesesTrabalhados: dadosContrato.mesesTrabalhados,
        }
      });
    } else {
      // Criar novo cálculo
      await salvarCalculo({
        nome: nomeCalculo,
        timestamp: new Date().toISOString(),
        verbasRescisorias: resultados.verbasRescisorias,
        adicionais: resultados.adicionais,
        totalGeral: totalGeral,
        userId: user.id,
        nomeEscritorio,
        dadosContrato: {
          dataAdmissao: dadosContrato.dataAdmissao,
          dataDemissao: dadosContrato.dataDemissao,
          salarioBase: dadosContrato.salarioBase,
          tipoRescisao: dadosContrato.tipoRescisao,
          diasTrabalhados: dadosContrato.diasTrabalhados,
          mesesTrabalhados: dadosContrato.mesesTrabalhados,
        }
      });
    }
    
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

  const handleApagar = async (id: string) => {
    await excluirCalculo(id);
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
        nomeEscritorio: selectedCalculoForPeticao.nomeEscritorio || profile?.nome_completo || 'Usuário'
      }));
      
      setConfirmDialogOpen(false);
      toast.success('Cálculo preparado para ser inserido na petição!');
      
      const confirmRedirect = window.confirm('Deseja ir para a página de petições agora?');
      if (confirmRedirect) {
        navigate('/peticoes');
      }
    }
  };

  const recarregarCalculosSalvos = () => {
    recarregarCalculos();
  };

  const calculosFiltrados = calculosSalvos;

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
    loading,
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
    recarregarCalculosSalvos,
  };
};

export default useCalculosSalvos;
