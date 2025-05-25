
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  nome: string;
  email: string;
  tipo_plano: 'padrao' | 'premium';
  tipo_usuario: 'usuario' | 'admin_mestre';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export const useSupabaseAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signUp = async (email: string, password: string, nome: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome: nome
          }
        }
      });

      if (error) throw error;

      toast.success('Cadastro realizado com sucesso! Verifique seu email para confirmar a conta.');
      return { data, error: null };
    } catch (error: any) {
      toast.error(error.message || 'Erro ao realizar cadastro');
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      toast.success('Login realizado com sucesso!');
      navigate('/home');
      return { data, error: null };
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setSession(null);
      setProfile(null);
      
      toast.success('Logout realizado com sucesso!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer logout');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-senha`
      });

      if (error) throw error;

      toast.success('Email de redefinição enviado! Verifique sua caixa de entrada.');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Erro ao enviar email de redefinição');
      return { error };
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'Usuário não autenticado' };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      toast.success('Perfil atualizado com sucesso!');
      return { data, error: null };
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar perfil');
      return { data: null, error };
    }
  };

  return {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    isAdmin: profile?.tipo_usuario === 'admin_mestre',
    isPremium: profile?.tipo_plano === 'premium' || profile?.tipo_usuario === 'admin_mestre'
  };
};
