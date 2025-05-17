
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { UserData } from '@/types/user';
import UserProfile from './UserProfile';
import AdminPanel from './AdminPanel';
import UserPanelsView from './UserPanelsView';

const UserManagement = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMasterAdmin, setIsMasterAdmin] = useState(false);
  
  useEffect(() => {
    // Verificar se estamos visualizando como outro usuário
    const viewingAsUserId = localStorage.getItem('viewingAsUserId');
    const viewingAsUserName = localStorage.getItem('viewingAsUserName');
    const viewingAsUserEmail = localStorage.getItem('viewingAsUserEmail');
    
    if (viewingAsUserId && viewingAsUserName && viewingAsUserEmail) {
      // Exibir alerta de que estamos visualizando como outro usuário
      toast.info(`Visualizando como ${viewingAsUserName}`, {
        duration: 5000,
        id: 'viewing-as-toast',
      });
    }
    
    // Carregar dados do usuário atual
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    const userIsAdmin = localStorage.getItem('userIsAdmin') === 'true';
    const userLogoUrl = localStorage.getItem('userLogoUrl') || undefined;
    
    if (userId && userEmail) {
      setUserData({
        id: userId,
        nome: userName || 'Usuário',
        email: userEmail,
        isAdmin: userIsAdmin,
        logoUrl: userLogoUrl
      });
      setIsAdmin(userIsAdmin);
      
      // Verificar se é admin mestre (admin-1 OU email admin@juriscalc.com)
      const isMaster = userId === 'admin-1' || userEmail === 'admin@juriscalc.com';
      setIsMasterAdmin(isMaster);
      
      // Se for admin, carregar todos os usuários
      if (userIsAdmin) {
        loadAllUsers();
      }
    } else {
      // Se não tiver usuário logado, redirecionar para login
      navigate('/');
    }
  }, [navigate]);
  
  const loadAllUsers = () => {
    // Simula carregamento de usuários do localStorage (em uma aplicação real seria do banco de dados)
    const usersData = localStorage.getItem('allUsers');
    if (usersData) {
      try {
        const parsedUsers: UserData[] = JSON.parse(usersData);
        setAllUsers(parsedUsers);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        setAllUsers([]);
      }
    } else {
      setAllUsers([]);
    }
  };
  
  const handleLogout = () => {
    // Limpar dados de visualização como outro usuário
    localStorage.removeItem('viewingAsUserId');
    localStorage.removeItem('viewingAsUserName');
    localStorage.removeItem('viewingAsUserEmail');
    localStorage.removeItem('originalUserId');
    
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userIsAdmin');
    localStorage.removeItem('userLogoUrl');
    
    toast.success('Logout realizado com sucesso!');
    navigate('/');
  };

  const updateUserData = (updatedUser: UserData) => {
    setUserData(updatedUser);
    
    // Se for admin, atualizar na lista de usuários também
    if (isAdmin) {
      const updatedUsers = allUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      );
      setAllUsers(updatedUsers);
      localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
    }
  };

  const updateUsers = (updatedUsers: UserData[]) => {
    setAllUsers(updatedUsers);
    localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
  };
  
  return (
    <>
      {userData && (
        <UserProfile 
          userData={userData} 
          isMasterAdmin={isMasterAdmin}
          onLogout={handleLogout}
          updateUserData={updateUserData}
        />
      )}
      
      {/* Painel de Administração - Visível apenas para admins */}
      {isAdmin && (
        <AdminPanel 
          isMasterAdmin={isMasterAdmin}
          allUsers={allUsers}
          updateUsers={updateUsers}
        />
      )}

      {/* Visualização de Painéis - Visível apenas para o admin mestre */}
      {isMasterAdmin && (
        <UserPanelsView
          isMasterAdmin={isMasterAdmin}
          allUsers={allUsers}
        />
      )}
    </>
  );
};

export default UserManagement;
