import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { UserData } from '@/types/user';

export const useUserManagement = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMasterAdmin, setIsMasterAdmin] = useState(false);
  const [isLoggedInAsUser, setIsLoggedInAsUser] = useState(false);
  
  useEffect(() => {
    // Check if we're viewing as another user
    const viewingAsUserId = localStorage.getItem('viewingAsUserId');
    const viewingAsUserName = localStorage.getItem('viewingAsUserName');
    const viewingAsUserEmail = localStorage.getItem('viewingAsUserEmail');
    
    if (viewingAsUserId && viewingAsUserName && viewingAsUserEmail) {
      // Display alert that we're viewing as another user
      toast.info(`Visualizando como ${viewingAsUserName}`, {
        duration: 5000,
        id: 'viewing-as-toast',
      });
    }

    // Check if admin is logged in as another user
    const adminOriginalId = localStorage.getItem('adminOriginalId');
    setIsLoggedInAsUser(!!adminOriginalId);
    
    // Load current user data
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
      
      // Check if it's the master admin (admin-1 OR email admin@juriscalc.com)
      const isMaster = userId === 'admin-1' || userEmail === 'admin@juriscalc.com' || userEmail === 'johnnysantos_177@msn.com';
      setIsMasterAdmin(isMaster);
      
      // If admin, load all users
      if (userIsAdmin) {
        loadAllUsers();
      }
    } else {
      // If no user is logged in, redirect to login
      navigate('/');
    }
  }, [navigate]);
  
  const loadAllUsers = () => {
    // Simulates loading users from localStorage (in a real app this would be from a database)
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
    // Check if admin is logged in as another user
    if (isLoggedInAsUser) {
      const adminId = localStorage.getItem('adminOriginalId');
      const adminEmail = localStorage.getItem('adminOriginalEmail');
      const adminName = localStorage.getItem('adminOriginalName');
      
      // Restore admin credentials
      if (adminId && adminEmail) {
        localStorage.setItem('userId', adminId);
        localStorage.setItem('userEmail', adminEmail);
        localStorage.setItem('userName', adminName || 'Administrador');
        localStorage.setItem('userIsAdmin', 'true');
        
        // Clear temporary data
        localStorage.removeItem('adminOriginalId');
        localStorage.removeItem('adminOriginalEmail');
        localStorage.removeItem('adminOriginalName');
        
        toast.success('Retornando à conta de administrador');
        navigate('/peticoes');
        return;
      }
    }
    
    // Clear view as another user data
    localStorage.removeItem('viewingAsUserId');
    localStorage.removeItem('viewingAsUserName');
    localStorage.removeItem('viewingAsUserEmail');
    localStorage.removeItem('originalUserId');
    
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userIsAdmin');
    localStorage.removeItem('userLogoUrl');
    
    // Clear admin logged in as another user data
    localStorage.removeItem('adminOriginalId');
    localStorage.removeItem('adminOriginalEmail');
    localStorage.removeItem('adminOriginalName');
    
    toast.success('Logout realizado com sucesso!');
    navigate('/');
  };

  const updateUserData = (updatedUser: UserData) => {
    setUserData(updatedUser);
    
    // If admin, update user in the users list as well
    if (isAdmin) {
      const updatedUsers = allUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      );
      setAllUsers(updatedUsers);
      localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
    }
    
    // Update localStorage data if it's the current user
    const userId = localStorage.getItem('userId');
    if (userId === updatedUser.id) {
      localStorage.setItem('userEmail', updatedUser.email);
      localStorage.setItem('userName', updatedUser.nome);
      localStorage.setItem('userLogoUrl', updatedUser.logoUrl || '');
    }
  };

  const updateUsers = (updatedUsers: UserData[]) => {
    setAllUsers(updatedUsers);
    localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
    
    // If the current user is in the updated list, update current user data
    const userId = localStorage.getItem('userId');
    const updatedCurrentUser = updatedUsers.find(user => user.id === userId);
    
    if (updatedCurrentUser) {
      setUserData(updatedCurrentUser);
      localStorage.setItem('userEmail', updatedCurrentUser.email);
      localStorage.setItem('userName', updatedCurrentUser.nome);
      localStorage.setItem('userLogoUrl', updatedCurrentUser.logoUrl || '');
      
      // Check if still admin
      const stillAdmin = updatedCurrentUser.isAdmin;
      setIsAdmin(stillAdmin);
      localStorage.setItem('userIsAdmin', stillAdmin ? 'true' : 'false');
      
      // Check if still master admin
      const isMaster = updatedCurrentUser.id === 'admin-1' || 
                      updatedCurrentUser.email === 'admin@juriscalc.com' || 
                      updatedCurrentUser.email === 'johnnysantos_177@msn.com';
      setIsMasterAdmin(isMaster);
    }
  };

  // Return to original admin account
  const handleReturnToAdmin = () => {
    const adminId = localStorage.getItem('adminOriginalId');
    const adminEmail = localStorage.getItem('adminOriginalEmail');
    const adminName = localStorage.getItem('adminOriginalName');
    
    if (adminId && adminEmail) {
      // Restore admin credentials
      localStorage.setItem('userId', adminId);
      localStorage.setItem('userEmail', adminEmail);
      localStorage.setItem('userName', adminName || 'Administrador');
      localStorage.setItem('userIsAdmin', 'true');
      
      // Clear temporary data
      localStorage.removeItem('adminOriginalId');
      localStorage.removeItem('adminOriginalEmail');
      localStorage.removeItem('adminOriginalName');
      
      toast.success('Retornando à conta de administrador');
      navigate('/peticoes');
    }
  };
  
  return {
    userData,
    allUsers,
    isAdmin,
    isMasterAdmin,
    isLoggedInAsUser,
    handleLogout,
    updateUserData,
    updateUsers,
    handleReturnToAdmin
  };
};
