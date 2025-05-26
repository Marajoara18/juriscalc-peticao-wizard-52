
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from './auth/useSupabaseAuth';
import { toast } from 'sonner';
import { CalculoSalvo } from '@/types/calculoSalvo';

export const useSupabaseCalculos = () => {
  const { user } = useSupabaseAuth();
  const [calculosSalvos, setCalculosSalvos] = useState<CalculoSalvo[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCalculos = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('calculos_salvos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform Supabase data to match our CalculoSalvo interface
      const calculosTransformados = data.map(calculo => ({
        id: calculo.id,
        nome: calculo.nome,
        timestamp: calculo.timestamp || calculo.created_at || new Date().toISOString(),
        verbasRescisorias: calculo.verbas_rescisorias,
        adicionais: calculo.adicionais,
        totalGeral: Number(calculo.total_geral),
        userId: calculo.user_id,
        nomeEscritorio: calculo.nome_escritorio,
        dadosContrato: calculo.dados_contrato as CalculoSalvo['dadosContrato']
      }));

      setCalculosSalvos(calculosTransformados);
    } catch (error: any) {
      console.error('Erro ao carregar cálculos:', error);
      toast.error('Erro ao carregar cálculos salvos');
    } finally {
      setLoading(false);
    }
  };

  const salvarCalculo = async (calculo: Omit<CalculoSalvo, 'id'>) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('calculos_salvos')
        .insert({
          nome: calculo.nome,
          verbas_rescisorias: calculo.verbasRescisorias,
          adicionais: calculo.adicionais,
          total_geral: calculo.totalGeral,
          user_id: user.id,
          nome_escritorio: calculo.nomeEscritorio,
          timestamp: calculo.timestamp,
          dados_contrato: calculo.dadosContrato
        })
        .select()
        .single();

      if (error) throw error;

      const novoCalculo: CalculoSalvo = {
        id: data.id,
        nome: data.nome,
        timestamp: data.timestamp || data.created_at || new Date().toISOString(),
        verbasRescisorias: data.verbas_rescisorias,
        adicionais: data.adicionais,
        totalGeral: Number(data.total_geral),
        userId: data.user_id,
        nomeEscritorio: data.nome_escritorio,
        dadosContrato: data.dados_contrato as CalculoSalvo['dadosContrato']
      };

      setCalculosSalvos(prev => [novoCalculo, ...prev]);
      toast.success('Cálculo salvo com sucesso!');
      return novoCalculo;
    } catch (error: any) {
      console.error('Erro ao salvar cálculo:', error);
      toast.error('Erro ao salvar cálculo');
      return null;
    }
  };

  const atualizarCalculo = async (id: string, updates: Partial<CalculoSalvo>) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return null;
    }

    try {
      const updateData: any = {};
      
      if (updates.nome !== undefined) updateData.nome = updates.nome;
      if (updates.verbasRescisorias !== undefined) updateData.verbas_rescisorias = updates.verbasRescisorias;
      if (updates.adicionais !== undefined) updateData.adicionais = updates.adicionais;
      if (updates.totalGeral !== undefined) updateData.total_geral = updates.totalGeral;
      if (updates.nomeEscritorio !== undefined) updateData.nome_escritorio = updates.nomeEscritorio;
      if (updates.timestamp !== undefined) updateData.timestamp = updates.timestamp;
      if (updates.dadosContrato !== undefined) updateData.dados_contrato = updates.dadosContrato;

      const { data, error } = await supabase
        .from('calculos_salvos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const calculoAtualizado: CalculoSalvo = {
        id: data.id,
        nome: data.nome,
        timestamp: data.timestamp || data.created_at || new Date().toISOString(),
        verbasRescisorias: data.verbas_rescisorias,
        adicionais: data.adicionais,
        totalGeral: Number(data.total_geral),
        userId: data.user_id,
        nomeEscritorio: data.nome_escritorio,
        dadosContrato: data.dados_contrato as CalculoSalvo['dadosContrato']
      };

      setCalculosSalvos(prev => 
        prev.map(calc => calc.id === id ? calculoAtualizado : calc)
      );

      toast.success('Cálculo atualizado com sucesso!');
      return calculoAtualizado;
    } catch (error: any) {
      console.error('Erro ao atualizar cálculo:', error);
      toast.error('Erro ao atualizar cálculo');
      return null;
    }
  };

  const excluirCalculo = async (id: string) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return false;
    }

    try {
      const { error } = await supabase
        .from('calculos_salvos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCalculosSalvos(prev => prev.filter(calc => calc.id !== id));
      toast.success('Cálculo excluído com sucesso!');
      return true;
    } catch (error: any) {
      console.error('Erro ao excluir cálculo:', error);
      toast.error('Erro ao excluir cálculo');
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchCalculos();
    } else {
      setCalculosSalvos([]);
    }
  }, [user]);

  return {
    calculosSalvos,
    loading,
    salvarCalculo,
    atualizarCalculo,
    excluirCalculo,
    recarregarCalculos: fetchCalculos
  };
};
