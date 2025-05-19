
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LoginFormData, User } from '@/types/auth';

export const useAuthLogin = () => {
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
    
    // Atualizar valores no localStorage
    localStorage.setItem('isPremiumInitialized', 'true');
  };

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
    localStorage.setItem('isPremium', String(!!user.isPremium || !!user.isAdmin));
    
    if (user.logoUrl) {
      localStorage.setItem('userLogoUrl', user.logoUrl);
    }
    
    toast.success('Login realizado com sucesso!');
    navigate('/calculadora');
  };
  
  return {
    handleLogin,
    initializeAdminUser
  };
};
