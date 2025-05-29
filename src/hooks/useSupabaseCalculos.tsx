
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuthOnly } from './auth/useSupabaseAuthOnly';
import { toast } from 'sonner';
import { CalculoSalvo } from '@/types/calculoSalvo';

export const useSupabaseCalculos = () => {
  const { user } = useSupabaseAuthOnly();
  const [calculosSalvos, setCalculosSalvos] = useState<CalculoSalvo[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCalculos = async () => {
    if (!user) {
      console.log('SUPABASE_CALCULOS: Usuário não autenticado, não é possível buscar cálculos');
      setCalculosSalvos([]);
      return;
    }
    
    console.log('SUPABASE_CALCULOS: Iniciando busca de cálculos para usuário:', user.id);
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('calculos_salvos')
        .select('*')
        .eq('usuario_id', user.id);

      if (error) {
        console.error('SUPABASE_CALCULOS: Erro na busca do Supabase:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('SUPABASE_CALCULOS: Dados brutos recebidos do Supabase:', data);
      console.log('SUPABASE_CALCULOS: Quantidade de cálculos encontrados:', data?.length || 0);

      // Transform Supabase data to match our CalculoSalvo interface
      const calculosTransformados = (data || []).map(calculo => {
        console.log('SUPABASE_CALCULOS: Transformando cálculo:', calculo.id);
        
        const dadosEntrada = calculo.dados_entrada_json as any;
        const resultadoCalculo = calculo.resultado_calculo_json as any;
        
        const calculoTransformado = {
          id: calculo.id,
          nome: calculo.titulo_calculo,
          timestamp: calculo.data_criacao,
          verbasRescisorias: (dadosEntrada?.verbasRescisorias || resultadoCalculo?.verbasRescisorias || {}) as any,
          adicionais: (dadosEntrada?.adicionais || resultadoCalculo?.adicionais || {}) as any,
          totalGeral: Number(resultadoCalculo?.totalGeral || 0),
          userId: calculo.usuario_id,
          nomeEscritorio: (dadosEntrada?.nomeEscritorio || 'Usuário') as string,
          dadosContrato: (dadosEntrada?.dadosContrato || {}) as any
        };
        
        console.log('SUPABASE_CALCULOS: Cálculo transformado:', calculoTransformado);
        return calculoTransformado;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      console.log('SUPABASE_CALCULOS: Total de cálculos transformados e ordenados:', calculosTransformados.length);
      setCalculosSalvos(calculosTransformados);
    } catch (error: any) {
      console.error('SUPABASE_CALCULOS: Erro ao carregar cálculos:', {
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
      console.error('SUPABASE_CALCULOS: Tentativa de salvar sem usuário autenticado');
      toast.error('Usuário não autenticado. Faça login novamente.');
      return null;
    }

    console.log('SUPABASE_CALCULOS: Iniciando salvamento de cálculo:', {
      userId: user.id,
      nome: calculo.nome,
      totalGeral: calculo.totalGeral
    });

    try {
      const dadosEntrada = {
        verbasRescisorias: calculo.verbasRescisorias || {},
        adicionais: calculo.adicionais || {},
        dadosContrato: calculo.dadosContrato || {},
        nomeEscritorio: calculo.nomeEscritorio || 'Usuário'
      };

      const resultadoCalculo = {
        verbasRescisorias: calculo.verbasRescisorias || {},
        adicionais: calculo.adicionais || {},
        totalGeral: calculo.totalGeral || 0
      };

      console.log('SUPABASE_CALCULOS: Dados preparados para inserção:', {
        dadosEntrada,
        resultadoCalculo
      });

      const calculoData = {
        titulo_calculo: calculo.nome,
        usuario_id: user.id,
        dados_entrada_json: dadosEntrada,
        resultado_calculo_json: resultadoCalculo,
        tipo_calculo: 'geral' as const
      };

      console.log('SUPABASE_CALCULOS: Dados finais para inserção:', calculoData);

      const { data, error } = await supabase
        .from('calculos_salvos')
        .insert(calculoData)
        .select()
        .single();

      if (error) {
        console.error('SUPABASE_CALCULOS: Erro detalhado na inserção:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('SUPABASE_CALCULOS: Cálculo salvo com sucesso no Supabase:', data);

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

      setCalculosSalvos(prev => {
        console.log('SUPABASE_CALCULOS: Adicionando cálculo à lista local');
        return [novoCalculo, ...prev];
      });
      
      toast.success('Cálculo salvo com sucesso!');
      return novoCalculo;
    } catch (error: any) {
      console.error('SUPABASE_CALCULOS: Erro detalhado no salvamento:', error);
      
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
      console.error('SUPABASE_CALCULOS: User not authenticated for update');
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
      console.error('SUPABASE_CALCULOS: Error updating calculation:', error);
      toast.error('Erro ao atualizar cálculo: ' + (error.message || 'Erro desconhecido'));
      return null;
    }
  };

  const excluirCalculo = async (id: string) => {
    if (!user) {
      console.error('SUPABASE_CALCULOS: User not authenticated for delete');
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
      console.error('SUPABASE_CALCULOS: Error deleting calculation:', error);
      toast.error('Erro ao excluir cálculo: ' + (error.message || 'Erro desconhecido'));
      return false;
    }
  };

  useEffect(() => {
    console.log('SUPABASE_CALCULOS: useEffect executado, user:', !!user);
    if (user) {
      console.log('SUPABASE_CALCULOS: Usuário encontrado, buscando cálculos');
      fetchCalculos();
    } else {
      console.log('SUPABASE_CALCULOS: Nenhum usuário, limpando lista de cálculos');
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
