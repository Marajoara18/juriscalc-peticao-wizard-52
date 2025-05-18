
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
        email: 'admin@juriscalc.com',
        senha: 'admin123',
        isAdmin: true,
        canViewPanels: true,
        isPremium: true
      };
      
      allUsers.push(adminUser);
      localStorage.setItem('allUsers', JSON.stringify(allUsers));
      console.log('Usuário admin criado com sucesso!');
    } else {
      // Verificar se o usuário admin@juriscalc.com existe, e se existir, garantir que seja admin
      const adminIndex = allUsers.findIndex(u => u.email === 'admin@juriscalc.com');
      if (adminIndex >= 0) {
        // Garantir que o usuário tenha privilégios de administrador mestre
        allUsers[adminIndex].isAdmin = true;
        allUsers[adminIndex].canViewPanels = true;
        allUsers[adminIndex].isPremium = true;
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
      }
      
      // Garantir que johnnysantos_177@msn.com sempre tenha acesso ilimitado
      const masterAdminIndex = allUsers.findIndex(u => u.email === 'johnnysantos_177@msn.com');
      if (masterAdminIndex >= 0) {
        // Garantir que o administrador mestre tenha todos os privilégios
        allUsers[masterAdminIndex].isAdmin = true;
        allUsers[masterAdminIndex].canViewPanels = true;
        allUsers[masterAdminIndex].isPremium = true;
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
      }
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
    
    // Verificar se é o admin mestre e atualizar seus privilégios
    if (user.email === 'admin@juriscalc.com' || user.email === 'johnnysantos_177@msn.com') {
      user.isAdmin = true;
      user.canViewPanels = true;
      user.isPremium = true;
      
      // Atualizar o usuário no array
      const updatedUsers = allUsers.map((u: User) => 
        (u.email === 'admin@juriscalc.com' || u.email === 'johnnysantos_177@msn.com') 
          ? {...u, isAdmin: true, canViewPanels: true, isPremium: true} 
          : u
      );
      
      localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
    }
    
    // Login bem-sucedido
    localStorage.setItem('userId', user.id);
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('userName', user.nome);
    localStorage.setItem('userIsAdmin', String(user.isAdmin));
    localStorage.setItem('canViewPanels', String(!!user.canViewPanels));
    localStorage.setItem('isPremium', String(!!user.isPremium));
    
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
    
    // Verificar se é o e-mail do administrador mestre
    const isMasterAdmin = data.email === 'admin@juriscalc.com';
    
    // Criar novo usuário
    const newUser: User = {
      id: `user-${Date.now()}`,
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      isAdmin: isMasterAdmin, // Será admin se for o e-mail admin@juriscalc.com
      canViewPanels: isMasterAdmin, // Terá acesso aos painéis se for admin@juriscalc.com
      isPremium: isMasterAdmin // Terá acesso premium se for admin@juriscalc.com
    };
    
    allUsers.push(newUser);
    localStorage.setItem('allUsers', JSON.stringify(allUsers));
    
    // Fazer login automático
    localStorage.setItem('userId', newUser.id);
    localStorage.setItem('userEmail', newUser.email);
    localStorage.setItem('userName', newUser.nome);
    localStorage.setItem('userIsAdmin', String(newUser.isAdmin));
    localStorage.setItem('canViewPanels', String(!!newUser.canViewPanels));
    localStorage.setItem('isPremium', String(!!newUser.isPremium));
    
    toast.success('Cadastro realizado com sucesso!');
    navigate('/calculadora');
  };

  return {
    handleLogin,
    handleRegister
  };
};
