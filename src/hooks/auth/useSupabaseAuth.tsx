
import { useState, useEffect, useCallback } from 'react';
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

interface User {
  id: string;
  email: string;
}

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Função para criar um perfil padrão
  const createDefaultProfile = useCallback((user: User): Profile => {
    return {
      id: user.id,
      nome: user.email?.split('@')[0] || 'Usuário',
      email: user.email || '',
      tipo_usuario: user.email === 'admin@juriscalc.com' || user.email === 'johnnysantos_177@msn.com' ? 'admin_mestre' : 'usuario',
      tipo_plano: user.email === 'admin@juriscalc.com' || user.email === 'johnnysantos_177@msn.com' ? 'premium' : 'padrao',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }, []);

  // Verificar sessão atual usando localStorage
  const checkSession = useCallback(async () => {
    try {
      console.log('AUTH: Checking localStorage session...');
      const userId = localStorage.getItem('userId');
      const userEmail = localStorage.getItem('userEmail');
      
      if (userId && userEmail) {
        console.log('AUTH: Found localStorage session for user:', userId);
        const userData: User = { id: userId, email: userEmail };
        setUser(userData);
        
        // Criar perfil baseado nos dados do localStorage
        const userProfile = createDefaultProfile(userData);
        setProfile(userProfile);
        
        console.log('AUTH: Session restored successfully:', { userId, userEmail });
      } else {
        console.log('AUTH: No localStorage session found');
        setUser(null);
        setProfile(null);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('AUTH: Error in checkSession:', error);
      setLoading(false);
    }
  }, [createDefaultProfile]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('AUTH: SignIn attempt for:', email);
      setLoading(true);
      
      // Simular autenticação com dados mockados
      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      
      // Adicionar usuário admin padrão se não existir
      if (allUsers.length === 0) {
        const adminUser = {
          id: 'admin-1',
          nome: 'Administrador',
          email: 'admin@juriscalc.com',
          senha: 'admin123',
          isAdmin: true,
          canViewPanels: true,
          isPremium: true
        };
        allUsers.push(adminUser);
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
      }

      // Verificar credenciais
      const user = allUsers.find((u: any) => u.email === email && u.senha === password);
      
      if (!user) {
        console.error('AUTH: Invalid credentials');
        setLoading(false);
        return { error: { message: 'E-mail ou senha incorretos' } };
      }

      // Salvar dados da sessão no localStorage
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userName', user.nome);
      localStorage.setItem('userIsAdmin', String(user.isAdmin || false));
      localStorage.setItem('canViewPanels', String(user.canViewPanels || false));
      localStorage.setItem('isPremium', String(user.isPremium || user.isAdmin || false));

      // Criar objetos de usuário e perfil
      const userData: User = { id: user.id, email: user.email };
      const userProfile = createDefaultProfile(userData);
      
      setUser(userData);
      setProfile(userProfile);
      setLoading(false);

      console.log('AUTH: Login successful, redirecting to /home');
      
      // Redirecionamento após login bem-sucedido
      setTimeout(() => {
        navigate('/home', { replace: true });
      }, 100);

      return { data: { user: userData, session: { user: userData } } };
    } catch (error) {
      console.error('AUTH: Error in signIn:', error);
      setLoading(false);
      return { error: { message: 'Erro inesperado no login' } };
    }
  };

  const signUp = async (email: string, password: string, nome: string) => {
    try {
      console.log('AUTH: SignUp attempt for:', email);
      setLoading(true);
      
      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      
      // Verificar se usuário já existe
      const existingUser = allUsers.find((u: any) => u.email === email);
      if (existingUser) {
        setLoading(false);
        return { error: { message: 'Este e-mail já está cadastrado' } };
      }

      // Criar novo usuário
      const newUser = {
        id: Date.now().toString(),
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha: password,
        isAdmin: false,
        canViewPanels: false,
        isPremium: false
      };

      allUsers.push(newUser);
      localStorage.setItem('allUsers', JSON.stringify(allUsers));

      setLoading(false);
      return { data: { user: { id: newUser.id, email: newUser.email } } };
    } catch (error) {
      console.error('AUTH: Error in signUp:', error);
      setLoading(false);
      return { error: { message: 'Erro inesperado no cadastro' } };
    }
  };

  const signOut = async () => {
    try {
      console.log('AUTH: Signing out user');
      
      // Limpar localStorage
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      localStorage.removeItem('userIsAdmin');
      localStorage.removeItem('canViewPanels');
      localStorage.removeItem('isPremium');
      
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
      toast.success('Email de recuperação enviado! (simulado)');
      return { data: 'success' };
    } catch (error) {
      console.error('AUTH: Erro na recuperação de senha:', error);
      toast.error('Erro inesperado na recuperação de senha');
      return { error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      toast.success('Senha atualizada com sucesso! (simulado)');
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
