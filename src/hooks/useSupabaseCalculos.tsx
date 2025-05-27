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
    if (!user) {
      console.log('CALCULOS: No user authenticated for fetch');
      return;
    }
    
    console.log('CALCULOS: Starting fetch for user:', user.id);
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('calculos_salvos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('CALCULOS: Supabase fetch error:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('CALCULOS: Successfully fetched', data?.length || 0, 'calculations');

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
      console.error('CALCULOS: Error loading calculations:', {
        message: error?.message,
        code: error?.code,
        stack: error?.stack,
        error
      });
      toast.error('Erro ao carregar cálculos salvos: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  const salvarCalculo = async (calculo: Omit<CalculoSalvo, 'id'>) => {
    if (!user) {
      console.error('CALCULOS: User not authenticated for save');
      toast.error('Usuário não autenticado. Faça login novamente.');
      return null;
    }

    console.log('CALCULOS: Starting save process for user:', user.id);
    console.log('CALCULOS: Calculation data to save:', {
      nome: calculo.nome,
      totalGeral: calculo.totalGeral,
      hasVerbas: !!calculo.verbasRescisorias,
      hasAdicionais: !!calculo.adicionais,
      hasContrato: !!calculo.dadosContrato
    });

    try {
      const calculoData = {
        nome: calculo.nome,
        verbas_rescisorias: calculo.verbasRescisorias,
        adicionais: calculo.adicionais,
        total_geral: calculo.totalGeral,
        user_id: user.id,
        nome_escritorio: calculo.nomeEscritorio,
        timestamp: calculo.timestamp,
        dados_contrato: calculo.dadosContrato
      };

      console.log('CALCULOS: Inserting data into Supabase:', {
        ...calculoData,
        verbas_rescisorias: calculoData.verbas_rescisorias ? 'present' : 'missing',
        adicionais: calculoData.adicionais ? 'present' : 'missing',
        dados_contrato: calculoData.dados_contrato ? 'present' : 'missing'
      });

      const { data, error } = await supabase
        .from('calculos_salvos')
        .insert(calculoData)
        .select()
        .single();

      if (error) {
        console.error('CALCULOS: Supabase insert error:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('CALCULOS: Successfully saved calculation:', {
        id: data.id,
        nome: data.nome,
        created_at: data.created_at
      });

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
      console.error('CALCULOS: Error saving calculation:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        stack: error?.stack
      });
      
      // Mensagens de erro mais específicas
      if (error.code === 'PGRST301') {
        toast.error('Erro de permissão. Verifique se você está logado corretamente.');
      } else if (error.code === '23505') {
        toast.error('Já existe um cálculo com este nome. Use um nome diferente.');
      } else if (error.code === '23502') {
        toast.error('Dados obrigatórios estão faltando. Verifique o cálculo e tente novamente.');
      } else if (error.message?.includes('JWT')) {
        toast.error('Sessão expirada. Faça login novamente.');
      } else {
        toast.error(`Erro ao salvar cálculo: ${error.message || 'Erro desconhecido'}`);
      }
      return null;
    }
  };

  const atualizarCalculo = async (id: string, updates: Partial<CalculoSalvo>) => {
    if (!user) {
      console.error('CALCULOS: User not authenticated for update');
      toast.error('Usuário não autenticado');
      return null;
    }

    console.log('CALCULOS: Starting update for calculation:', id);

    try {
      const updateData: any = {};
      
      if (updates.nome !== undefined) updateData.nome = updates.nome;
      if (updates.verbasRescisorias !== undefined) updateData.verbas_rescisorias = updates.verbasRescisorias;
      if (updates.adicionais !== undefined) updateData.adicionais = updates.adicionais;
      if (updates.totalGeral !== undefined) updateData.total_geral = updates.totalGeral;
      if (updates.nomeEscritorio !== undefined) updateData.nome_escritorio = updates.nomeEscritorio;
      if (updates.timestamp !== undefined) updateData.timestamp = updates.timestamp;
      if (updates.dadosContrato !== undefined) updateData.dados_contrato = updates.dadosContrato;

      console.log('CALCULOS: Update data:', updateData);

      const { data, error } = await supabase
        .from('calculos_salvos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('CALCULOS: Supabase update error:', error);
        throw error;
      }

      console.log('CALCULOS: Successfully updated calculation:', data);

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
      console.error('CALCULOS: Error updating calculation:', error);
      toast.error('Erro ao atualizar cálculo: ' + (error.message || 'Erro desconhecido'));
      return null;
    }
  };

  const excluirCalculo = async (id: string) => {
    if (!user) {
      console.error('CALCULOS: User not authenticated for delete');
      toast.error('Usuário não autenticado');
      return false;
    }

    console.log('CALCULOS: Starting delete for calculation:', id);

    try {
      const { error } = await supabase
        .from('calculos_salvos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('CALCULOS: Supabase delete error:', error);
        throw error;
      }

      console.log('CALCULOS: Successfully deleted calculation:', id);

      setCalculosSalvos(prev => prev.filter(calc => calc.id !== id));
      toast.success('Cálculo excluído com sucesso!');
      return true;
    } catch (error: any) {
      console.error('CALCULOS: Error deleting calculation:', error);
      toast.error('Erro ao excluir cálculo: ' + (error.message || 'Erro desconhecido'));
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      console.log('CALCULOS: User authenticated, fetching calculations for:', user.id);
      fetchCalculos();
    } else {
      console.log('CALCULOS: User not authenticated, clearing calculations');
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
