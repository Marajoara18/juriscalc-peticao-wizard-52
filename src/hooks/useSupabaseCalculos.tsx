
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
        .order('data_criacao', { ascending: false });

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
        nome: calculo.titulo_calculo,
        timestamp: calculo.data_criacao,
        verbasRescisorias: calculo.dados_entrada_json?.verbasRescisorias || calculo.resultado_calculo_json?.verbasRescisorias,
        adicionais: calculo.dados_entrada_json?.adicionais || calculo.resultado_calculo_json?.adicionais,
        totalGeral: Number(calculo.resultado_calculo_json?.totalGeral || 0),
        userId: calculo.usuario_id,
        nomeEscritorio: calculo.dados_entrada_json?.nomeEscritorio || 'Usuário',
        dadosContrato: calculo.dados_entrada_json?.dadosContrato || {}
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

    try {
      const calculoData = {
        titulo_calculo: calculo.nome,
        dados_entrada_json: {
          verbasRescisorias: calculo.verbasRescisorias,
          adicionais: calculo.adicionais,
          dadosContrato: calculo.dadosContrato,
          nomeEscritorio: calculo.nomeEscritorio
        },
        resultado_calculo_json: {
          verbasRescisorias: calculo.verbasRescisorias,
          adicionais: calculo.adicionais,
          totalGeral: calculo.totalGeral
        },
        usuario_id: user.id,
        tipo_calculo: 'geral' as const
      };

      const { data, error } = await supabase
        .from('calculos_salvos')
        .insert(calculoData)
        .select()
        .single();

      if (error) {
        console.error('CALCULOS: Supabase insert error:', error);
        throw error;
      }

      console.log('CALCULOS: Successfully saved calculation:', data);

      const novoCalculo: CalculoSalvo = {
        id: data.id,
        nome: data.titulo_calculo,
        timestamp: data.data_criacao,
        verbasRescisorias: calculo.verbasRescisorias,
        adicionais: calculo.adicionais,
        totalGeral: calculo.totalGeral,
        userId: data.usuario_id,
        nomeEscritorio: calculo.nomeEscritorio,
        dadosContrato: calculo.dadosContrato
      };

      setCalculosSalvos(prev => [novoCalculo, ...prev]);
      toast.success('Cálculo salvo com sucesso!');
      return novoCalculo;
    } catch (error: any) {
      console.error('CALCULOS: Error saving calculation:', error);
      
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

    try {
      const updateData: any = {};
      
      if (updates.nome !== undefined) updateData.titulo_calculo = updates.nome;
      
      if (updates.verbasRescisorias !== undefined || updates.adicionais !== undefined || updates.dadosContrato !== undefined) {
        updateData.dados_entrada_json = {
          verbasRescisorias: updates.verbasRescisorias,
          adicionais: updates.adicionais,
          dadosContrato: updates.dadosContrato,
          nomeEscritorio: updates.nomeEscritorio
        };
        updateData.resultado_calculo_json = {
          verbasRescisorias: updates.verbasRescisorias,
          adicionais: updates.adicionais,
          totalGeral: updates.totalGeral
        };
      }

      const { data, error } = await supabase
        .from('calculos_salvos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const calculoAtualizado: CalculoSalvo = {
        id: data.id,
        nome: data.titulo_calculo,
        timestamp: data.data_criacao,
        verbasRescisorias: updates.verbasRescisorias || {},
        adicionais: updates.adicionais || {},
        totalGeral: updates.totalGeral || 0,
        userId: data.usuario_id,
        nomeEscritorio: updates.nomeEscritorio || 'Usuário',
        dadosContrato: updates.dadosContrato || {}
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
      console.error('CALCULOS: Error deleting calculation:', error);
      toast.error('Erro ao excluir cálculo: ' + (error.message || 'Erro desconhecido'));
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
