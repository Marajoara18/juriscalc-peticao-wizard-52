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

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  }, []);

  const checkSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        setLoading(false);
        return;
      }

      if (session?.user) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email || ''
        };
        setUser(userData);

        // Fetch user profile
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);
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
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email || ''
        };
        setUser(userData);

        // Fetch user profile
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [checkSession, fetchProfile]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('SignIn error:', error);
        return { error: { message: error.message } };
      }

      if (data.user) {
        const userData: User = {
          id: data.user.id,
          email: data.user.email || ''
        };
        setUser(userData);

        // Fetch user profile
        const profileData = await fetchProfile(data.user.id);
        setProfile(profileData);

        navigate('/home', { replace: true });
      }

      setLoading(false);
      return { data };
    } catch (error: any) {
      console.error('Error in signIn:', error);
      setLoading(false);
      return { error: { message: 'Erro inesperado no login' } };
    }
  };

  const signUp = async (email: string, password: string, nome: string) => {
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
        console.error('SignUp error:', error);
        setLoading(false);
        return { error: { message: error.message } };
      }

      setLoading(false);
      return { data };
    } catch (error: any) {
      console.error('Error in signUp:', error);
      setLoading(false);
      return { error: { message: 'Erro inesperado no cadastro' } };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('SignOut error:', error);
        toast.error('Erro ao fazer logout');
        return;
      }

      setUser(null);
      setProfile(null);
      toast.success('Logout realizado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Error in signOut:', error);
      toast.error('Erro inesperado no logout');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        console.error('Reset password error:', error);
        toast.error('Erro ao enviar email de recuperação');
        return { error };
      }

      toast.success('Email de recuperação enviado!');
      return { data: 'success' };
    } catch (error) {
      console.error('Error in resetPassword:', error);
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
        console.error('Update password error:', error);
        toast.error('Erro ao atualizar senha');
        return { error };
      }

      toast.success('Senha atualizada com sucesso!');
      return { data: 'success' };
    } catch (error) {
      console.error('Error in updatePassword:', error);
      toast.error('Erro inesperado ao atualizar senha');
      return { error };
    }
  };

  // Derived states
  const isPremium = profile?.plano_id?.includes('premium') || false;
  const isAdmin = profile?.plano_id === 'admin' || false;

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
