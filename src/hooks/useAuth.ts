
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { User, LoginFormData, RegisterFormData } from '@/types/auth';

export const useAuth = () => {
  const navigate = useNavigate();
  
  const initializeAdminUser = () => {
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    
    // Se não houver usuários, criar um admin
    if (allUsers.length === 0) {
      const adminUser: User = {
        id: 'admin-1',
        nome: 'Administrador',
        email: 'admin@iuscalc.com',
        senha: 'admin123',
        isAdmin: true,
        canViewPanels: true
      };
      
      allUsers.push(adminUser);
      localStorage.setItem('allUsers', JSON.stringify(allUsers));
      console.log('Usuário admin criado com sucesso!');
    }
  };

  // Verificar se já está logado
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      navigate('/calculadora');
    }
    
    // Inicializar usuário admin se não existir
    initializeAdminUser();
  }, [navigate]);
  
  const handleLogin = (data: LoginFormData) => {
    if (!data.email || !data.senha) {
      toast.error('Preencha todos os campos');
      return;
    }
    
    // Buscar usuários do localStorage
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    
    // Encontrar usuário com o email informado
    const user = allUsers.find((u: User) => u.email === data.email);
    
    if (!user) {
      toast.error('Usuário não encontrado');
      return;
    }
    
    if (user.senha !== data.senha) {
      toast.error('Senha incorreta');
      return;
    }
    
    // Login bem-sucedido
    localStorage.setItem('userId', user.id);
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('userName', user.nome);
    localStorage.setItem('userIsAdmin', String(user.isAdmin));
    localStorage.setItem('canViewPanels', String(!!user.canViewPanels));
    
    if (user.logoUrl) {
      localStorage.setItem('userLogoUrl', user.logoUrl);
    }
    
    toast.success('Login realizado com sucesso!');
    navigate('/calculadora');
  };
  
  const handleRegister = (data: RegisterFormData) => {
    if (!data.nome || !data.email || !data.senha || !data.confirmSenha) {
      toast.error('Preencha todos os campos');
      return;
    }
    
    if (data.senha !== data.confirmSenha) {
      toast.error('As senhas não conferem');
      return;
    }
    
    // Buscar usuários do localStorage
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    
    // Verificar se já existe usuário com o mesmo email
    const userExists = allUsers.some((u: User) => u.email === data.email);
    
    if (userExists) {
      toast.error('Este e-mail já está cadastrado');
      return;
    }
    
    // Criar novo usuário
    const newUser: User = {
      id: `user-${Date.now()}`,
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      isAdmin: false,
      canViewPanels: false // Novos usuários não têm acesso aos painéis por padrão
    };
    
    allUsers.push(newUser);
    localStorage.setItem('allUsers', JSON.stringify(allUsers));
    
    // Fazer login automático
    localStorage.setItem('userId', newUser.id);
    localStorage.setItem('userEmail', newUser.email);
    localStorage.setItem('userName', newUser.nome);
    localStorage.setItem('userIsAdmin', 'false');
    localStorage.setItem('canViewPanels', 'false');
    
    toast.success('Cadastro realizado com sucesso!');
    navigate('/calculadora');
  };

  return {
    handleLogin,
    handleRegister
  };
};
