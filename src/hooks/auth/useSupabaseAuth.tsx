
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
    console.log('AUTH: Fetching profile for user:', userId);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('AUTH: Error fetching profile:', error);
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
            console.error('AUTH: Error creating profile:', createError);
            return;
          }
          
          console.log('AUTH: Profile created successfully:', createdProfile);
          setProfile(createdProfile);
          return;
        }
        return;
      }

      console.log('AUTH: Profile fetched successfully:', data);
      setProfile(data);
    } catch (error) {
      console.error('AUTH: Error fetching profile:', error);
    }
  }, [user?.email]);

  // Função para verificar a sessão atual
  const checkSession = useCallback(async () => {
    try {
      console.log('AUTH: Checking current session...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('AUTH: Error getting session:', error);
        setLoading(false);
        return;
      }

      if (session?.user) {
        console.log('AUTH: Session found for user:', session.user.id);
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        console.log('AUTH: No active session found');
        setUser(null);
        setProfile(null);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('AUTH: Error in checkSession:', error);
      setLoading(false);
    }
  }, [fetchProfile]);

  useEffect(() => {
    // Verificar sessão inicial
    checkSession();

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AUTH: Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('AUTH: User signed in, setting user and fetching profile');
          setUser(session.user);
          await fetchProfile(session.user.id);
          
          // Redirecionamento mais robusto após login bem-sucedido
          console.log('AUTH: Redirecting to /home after successful login');
          const currentPath = window.location.pathname;
          if (currentPath === '/' || currentPath === '/login') {
            try {
              navigate('/home', { replace: true });
            } catch (navError) {
              console.error('AUTH: Navigation error, using window.location:', navError);
              window.location.href = '/home';
            }
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('AUTH: User signed out, clearing state');
          setUser(null);
          setProfile(null);
        } else if (session?.user) {
          console.log('AUTH: Session updated, setting user');
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          console.log('AUTH: No session, clearing state');
          setUser(null);
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [checkSession, fetchProfile, navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('AUTH: SignIn attempt for:', email);
      
      // Verificar conexão com Supabase antes de tentar login
      const { data: healthCheck } = await supabase.from('profiles').select('count').limit(1);
      console.log('AUTH: Supabase connection check:', !!healthCheck);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('AUTH: SignIn response:', { 
        hasUser: !!data.user, 
        hasSession: !!data.session,
        error: error?.message 
      });

      if (error) {
        console.error('AUTH: SignIn error details:', error);
        return { error };
      }

      if (data.user && data.session) {
        console.log('AUTH: SignIn successful for user:', data.user.id);
        // O redirecionamento será feito pelo onAuthStateChange
        return { data };
      }
      
      return { data };
    } catch (error) {
      console.error('AUTH: Unexpected error in signIn:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, nome: string) => {
    try {
      console.log('AUTH: SignUp attempt for:', email);
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

      console.log('AUTH: SignUp response:', { data: !!data, error: error?.message });

      if (error) {
        console.error('AUTH: SignUp error details:', error);
        setLoading(false);
        return { error };
      }

      setLoading(false);
      return { data };
    } catch (error) {
      console.error('AUTH: Unexpected error in signUp:', error);
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
      console.error('AUTH: Erro no logout:', error);
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
      console.error('AUTH: Erro na recuperação de senha:', error);
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
      console.error('AUTH: Erro ao atualizar senha:', error);
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
