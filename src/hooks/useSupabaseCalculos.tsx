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
      console.log('CALCULOS: Usuário não autenticado, não é possível buscar cálculos');
      setCalculosSalvos([]);
      return;
    }
    
    console.log('CALCULOS: Iniciando busca de cálculos para usuário:', user.id);
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('calculos_salvos')
        .select('*')
        .order('data_criacao', { ascending: false });

      if (error) {
        console.error('CALCULOS: Erro na busca do Supabase:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('CALCULOS: Dados brutos recebidos do Supabase:', data);
      console.log('CALCULOS: Quantidade de cálculos encontrados:', data?.length || 0);

      // Transform Supabase data to match our CalculoSalvo interface
      const calculosTransformados = (data || []).map(calculo => {
        console.log('CALCULOS: Transformando cálculo:', calculo.id);
        
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
        
        console.log('CALCULOS: Cálculo transformado:', calculoTransformado);
        return calculoTransformado;
      });

      console.log('CALCULOS: Total de cálculos transformados:', calculosTransformados.length);
      setCalculosSalvos(calculosTransformados);
    } catch (error: any) {
      console.error('CALCULOS: Erro ao carregar cálculos:', {
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
      console.error('CALCULOS: Tentativa de salvar sem usuário autenticado');
      toast.error('Usuário não autenticado. Faça login novamente.');
      return null;
    }

    console.log('CALCULOS: Iniciando salvamento de cálculo:', {
      userId: user.id,
      nome: calculo.nome,
      totalGeral: calculo.totalGeral
    });

    try {
      // Primeiro, vamos tentar verificar se a tabela existe e suas colunas
      console.log('CALCULOS: Verificando estrutura da tabela...');
      
      // Dados simplificados para testar primeiro
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

      console.log('CALCULOS: Dados de entrada preparados:', dadosEntrada);
      console.log('CALCULOS: Resultado preparado:', resultadoCalculo);

      // Primeiro vamos tentar um insert mais simples
      const calculoData = {
        titulo_calculo: calculo.nome,
        usuario_id: user.id,
        dados_entrada_json: dadosEntrada,
        resultado_calculo_json: resultadoCalculo,
        tipo_calculo: 'geral' as const
      };

      console.log('CALCULOS: Dados finais para inserção:', calculoData);

      // Tentar inserir com tratamento de erro específico para cache
      const { data, error } = await supabase
        .from('calculos_salvos')
        .insert(calculoData)
        .select()
        .single();

      if (error) {
        console.error('CALCULOS: Erro detalhado na inserção:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });

        // Verificar se é erro de cache do schema
        if (error.message.includes('could not find') && error.message.includes('in the schema cache')) {
          console.error('CALCULOS: Erro de cache do schema detectado - tentando recarregar...');
          toast.error('Erro de cache do banco de dados. Aguarde alguns segundos e tente novamente.');
          
          // Aguardar um pouco e tentar novamente
          setTimeout(() => {
            toast.info('Tente salvar o cálculo novamente em alguns segundos.');
          }, 2000);
          
          return null;
        }

        throw error;
      }

      console.log('CALCULOS: Cálculo salvo com sucesso no Supabase:', data);

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
        console.log('CALCULOS: Adicionando cálculo à lista local');
        return [novoCalculo, ...prev];
      });
      
      toast.success('Cálculo salvo com sucesso!');
      return novoCalculo;
    } catch (error: any) {
      console.error('CALCULOS: Erro detalhado no salvamento:', error);
      
      if (error.code === 'PGRST301') {
        toast.error('Erro de permissão. Verifique se você está logado corretamente.');
      } else if (error.code === '23505') {
        toast.error('Já existe um cálculo com este nome. Use um nome diferente.');
      } else if (error.code === '23502') {
        toast.error('Dados obrigatórios estão faltando. Verifique o cálculo e tente novamente.');
      } else if (error.message?.includes('JWT')) {
        toast.error('Sessão expirada. Faça login novamente.');
      } else if (error.message?.includes('schema cache')) {
        toast.error('Erro temporário do sistema. Aguarde alguns segundos e tente novamente.');
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
    console.log('CALCULOS: useEffect executado, user:', !!user);
    if (user) {
      console.log('CALCULOS: Usuário encontrado, buscando cálculos');
      fetchCalculos();
    } else {
      console.log('CALCULOS: Nenhum usuário, limpando lista de cálculos');
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
