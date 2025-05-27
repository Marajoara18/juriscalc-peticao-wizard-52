import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Profile {
  id: string;
  nome: string;
  email: string;
  tipo_usuario: 'usuario' | 'admin_mestre';
  tipo_plano: 'padrao' | 'premium';
  created_at: string;
  updated_at: string;
}

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Função para buscar o perfil do usuário com controle de cache
  const fetchProfile = useCallback(async (userId: string) => {
    console.log('Fetching profile for user:', userId);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        // Se o perfil não existe, criar um novo
        if (error.code === 'PGRST116') {
          const newProfile = {
            id: userId,
            nome: user?.email?.split('@')[0] || 'Usuário',
            email: user?.email || '',
            tipo_usuario: 'usuario' as const,
            tipo_plano: 'padrao' as const
          };
          
          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert(newProfile)
            .select()
            .single();
            
          if (createError) {
            console.error('Error creating profile:', createError);
            return;
          }
          
          setProfile(createdProfile);
          return;
        }
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, [user?.email]);

  // Função para verificar a sessão atual
  const checkSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        setLoading(false);
        return;
      }

      if (session?.user) {
        console.log('Initial session check:', session.user.id);
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error in checkSession:', error);
      setLoading(false);
    }
  }, [fetchProfile]);

  useEffect(() => {
    // Verificar sessão inicial
    checkSession();

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [checkSession, fetchProfile]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('SignIn attempt for:', email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('SignIn response:', { data: !!data, error: error?.message });

      if (error) {
        console.error('SignIn error details:', error);
        toast.error('Erro ao fazer login: ' + error.message);
        setLoading(false);
        return { error };
      }

      if (data.user) {
        console.log('SignIn successful, redirecting to /home');
        toast.success('Login realizado com sucesso!');
        navigate('/home');
      }
      
      return { data };
    } catch (error) {
      console.error('Erro inesperado no login:', error);
      toast.error('Erro inesperado no login');
      setLoading(false);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, nome: string) => {
    try {
      console.log('SignUp attempt for:', email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome: nome,
          }
        }
      });

      console.log('SignUp response:', { data: !!data, error: error?.message });

      if (error) {
        console.error('SignUp error details:', error);
        toast.error('Erro ao criar conta: ' + error.message);
        setLoading(false);
        return { error };
      }

      toast.success('Conta criada com sucesso! Verifique seu email para confirmar.');
      return { data };
    } catch (error) {
      console.error('Erro inesperado no registro:', error);
      toast.error('Erro inesperado no registro');
      setLoading(false);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error('Erro ao fazer logout');
        return;
      }
      
      setUser(null);
      setProfile(null);
      toast.success('Logout realizado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Erro no logout:', error);
      toast.error('Erro inesperado no logout');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-senha`,
      });

      if (error) {
        toast.error('Erro ao enviar email de recuperação: ' + error.message);
        return { error };
      }

      toast.success('Email de recuperação enviado!');
      return { data: 'success' };
    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      toast.error('Erro inesperado na recuperação de senha');
      return { error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast.error('Erro ao atualizar senha: ' + error.message);
        return { error };
      }

      toast.success('Senha atualizada com sucesso!');
      return { data: 'success' };
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      toast.error('Erro inesperado ao atualizar senha');
      return { error };
    }
  };

  // Derived states
  const isPremium = profile?.tipo_plano === 'premium' || profile?.tipo_usuario === 'admin_mestre';
  const isAdmin = profile?.tipo_usuario === 'admin_mestre';

  return {
    user,
    profile,
    loading,
    isPremium,
    isAdmin,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  };
};
