import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  nome_completo: string;
  email: string;
  plano_id: string;
  oab?: string;
  data_criacao: string;
  data_atualizacao: string;
  limite_calculos_salvos?: number;
  limite_peticoes_salvas?: number;
}

interface User {
  id: string;
  email: string;
}

export const useSupabaseAuthOnly = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = useCallback(async (userId: string) => {
    console.log('SUPABASE_AUTH_ONLY: Buscando perfil para usuário:', userId);
    try {
      const { data, error } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('SUPABASE_AUTH_ONLY: Erro ao buscar perfil:', error);
        return null;
      }

      console.log('SUPABASE_AUTH_ONLY: Perfil encontrado:', data);
      return data;
    } catch (error) {
      console.error('SUPABASE_AUTH_ONLY: Erro inesperado ao buscar perfil:', error);
      return null;
    }
  }, []);

  const checkSession = useCallback(async () => {
    console.log('SUPABASE_AUTH_ONLY: Verificando sessão...');
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('SUPABASE_AUTH_ONLY: Erro ao obter sessão:', error);
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      if (session?.user) {
        console.log('SUPABASE_AUTH_ONLY: Sessão encontrada:', session.user.id, session.user.email);
        const userData: User = {
          id: session.user.id,
          email: session.user.email || ''
        };
        setUser(userData);

        const profileData = await fetchProfile(session.user.id);
        if (profileData) {
          console.log('SUPABASE_AUTH_ONLY: Perfil carregado com sucesso');
          setProfile(profileData);
        } else {
          console.log('SUPABASE_AUTH_ONLY: Perfil não encontrado');
        }
      } else {
        console.log('SUPABASE_AUTH_ONLY: Nenhuma sessão ativa encontrada');
        setUser(null);
        setProfile(null);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('SUPABASE_AUTH_ONLY: Erro inesperado na verificação de sessão:', error);
      setUser(null);
      setProfile(null);
      setLoading(false);
    }
  }, [fetchProfile]);

  useEffect(() => {
    console.log('SUPABASE_AUTH_ONLY: Inicializando hook de autenticação');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('SUPABASE_AUTH_ONLY: Mudança de estado de autenticação:', event);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('SUPABASE_AUTH_ONLY: Usuário logado:', session.user.id, session.user.email);
        const userData: User = {
          id: session.user.id,
          email: session.user.email || ''
        };
        setUser(userData);

        // Fetch profile after login with a small delay to avoid race conditions
        setTimeout(async () => {
          const profileData = await fetchProfile(session.user.id);
          if (profileData) {
            console.log('SUPABASE_AUTH_ONLY: Perfil carregado após login');
            setProfile(profileData);
          }
          setLoading(false);
        }, 100);
        
      } else if (event === 'SIGNED_OUT') {
        console.log('SUPABASE_AUTH_ONLY: Usuário deslogado');
        setUser(null);
        setProfile(null);
        setLoading(false);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        console.log('SUPABASE_AUTH_ONLY: Token refreshed, mantendo usuário');
        // Keep user and profile as they are, just ensure loading is false
        setLoading(false);
      }
    });

    // THEN check for existing session
    checkSession();

    return () => {
      console.log('SUPABASE_AUTH_ONLY: Limpando subscription');
      subscription.unsubscribe();
    };
  }, [checkSession, fetchProfile]);

  const signIn = async (email: string, password: string) => {
    console.log('SUPABASE_AUTH_ONLY: Tentativa de login para:', email);
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('SUPABASE_AUTH_ONLY: Erro no login:', error);
        setLoading(false);
        return { error: { message: error.message } };
      }

      if (data.user) {
        console.log('SUPABASE_AUTH_ONLY: Login bem-sucedido:', data.user.id);
        const userData: User = {
          id: data.user.id,
          email: data.user.email || ''
        };
        setUser(userData);

        const profileData = await fetchProfile(data.user.id);
        if (profileData) {
          setProfile(profileData);
          console.log('SUPABASE_AUTH_ONLY: Perfil definido, redirecionando para /home');
          navigate('/home', { replace: true });
        } else {
          console.log('SUPABASE_AUTH_ONLY: Perfil não encontrado, mas login foi bem-sucedido');
          navigate('/home', { replace: true });
        }
      }

      setLoading(false);
      return { data };
    } catch (error: any) {
      console.error('SUPABASE_AUTH_ONLY: Erro inesperado no login:', error);
      setLoading(false);
      return { error: { message: 'Erro inesperado no login' } };
    }
  };

  const signUp = async (email: string, password: string, nome: string) => {
    console.log('SUPABASE_AUTH_ONLY: Tentativa de cadastro para:', email);
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome_completo: nome
          }
        }
      });

      if (error) {
        console.error('SUPABASE_AUTH_ONLY: Erro no cadastro:', error);
        setLoading(false);
        return { error: { message: error.message } };
      }

      console.log('SUPABASE_AUTH_ONLY: Cadastro realizado:', data.user?.id);
      setLoading(false);
      return { data };
    } catch (error: any) {
      console.error('SUPABASE_AUTH_ONLY: Erro inesperado no cadastro:', error);
      setLoading(false);
      return { error: { message: 'Erro inesperado no cadastro' } };
    }
  };

  const signOut = async () => {
    console.log('SUPABASE_AUTH_ONLY: Tentativa de logout');
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('SUPABASE_AUTH_ONLY: Erro no logout:', error);
        toast.error('Erro ao fazer logout');
        setLoading(false);
        return;
      }

      setUser(null);
      setProfile(null);
      setLoading(false);
      console.log('SUPABASE_AUTH_ONLY: Logout realizado, redirecionando para /');
      toast.success('Logout realizado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('SUPABASE_AUTH_ONLY: Erro inesperado no logout:', error);
      toast.error('Erro inesperado no logout');
      setLoading(false);
    }
  };

  // Derived states
  const isPremium = profile?.plano_id?.includes('premium') || profile?.plano_id === 'admin' || false;
  const isAdmin = profile?.plano_id === 'admin' || false;
  
  console.log('SUPABASE_AUTH_ONLY: Estado atual:', {
    user: !!user,
    profile: !!profile,
    loading,
    isPremium,
    isAdmin,
    planId: profile?.plano_id
  });

  return {
    user,
    profile,
    loading,
    isPremium,
    isAdmin,
    signIn,
    signUp,
    signOut,
  };
};
