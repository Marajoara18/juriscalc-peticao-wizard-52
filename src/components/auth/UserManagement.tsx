
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LogOut, Users, User, Upload, Eye, EyeOff, Shield } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";

interface UserData {
  id: string;
  nome: string;
  email: string;
  isAdmin: boolean;
  logoUrl?: string;
  canViewPanels?: boolean;
}

const UserManagement = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [logoDialogOpen, setLogoDialogOpen] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMasterAdmin, setIsMasterAdmin] = useState(false);
  
  useEffect(() => {
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
      
      // Verificar se é admin mestre (admin-1)
      const isMaster = userId === 'admin-1';
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
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userIsAdmin');
    localStorage.removeItem('userLogoUrl');
    
    toast.success('Logout realizado com sucesso!');
    navigate('/');
  };
  
  const handleLogoUpload = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setLogoDialogOpen(true);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSaveLogo = () => {
    if (!logoFile || !logoPreview || !userData) return;
    
    // Em uma aplicação real, o arquivo seria enviado para um servidor
    // Neste exemplo, salvaremos o dataURL no localStorage
    localStorage.setItem('userLogoUrl', logoPreview);
    
    // Atualizar o usuário local
    const updatedUser = { ...userData, logoUrl: logoPreview };
    setUserData(updatedUser);
    
    // Se for admin, atualizar na lista de usuários também
    if (isAdmin) {
      const updatedUsers = allUsers.map(user => 
        user.id === userData.id ? updatedUser : user
      );
      setAllUsers(updatedUsers);
      localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
    }
    
    toast.success('Logotipo atualizado com sucesso!');
    setLogoDialogOpen(false);
  };
  
  const handleTogglePanelAccess = (userId: string, currentValue: boolean) => {
    // Apenas o admin mestre pode modificar permissões
    if (!isMasterAdmin) {
      toast.error('Apenas o administrador mestre pode modificar permissões de visualização.');
      return;
    }
    
    // Atualizar a lista de usuários com a nova permissão
    const updatedUsers = allUsers.map(user => {
      if (user.id === userId) {
        return { ...user, canViewPanels: !currentValue };
      }
      return user;
    });
    
    setAllUsers(updatedUsers);
    localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
    
    const userName = updatedUsers.find(user => user.id === userId)?.nome;
    toast.success(`Permissões de ${userName} atualizadas com sucesso!`);
  };
  
  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Perfil de Usuário</span>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="border-juriscalc-navy text-juriscalc-navy"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userData && (
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-shrink-0">
                {userData.logoUrl ? (
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-juriscalc-navy">
                    <img 
                      src={userData.logoUrl} 
                      alt="Logo" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-juriscalc-lightgray flex items-center justify-center border-2 border-juriscalc-navy">
                    <User size={40} className="text-juriscalc-navy" />
                  </div>
                )}
              </div>
              
              <div className="flex-grow">
                <h3 className="text-xl font-bold mb-1">{userData.nome}</h3>
                <p className="text-gray-600 mb-3">{userData.email}</p>
                <p className="text-sm mb-4">
                  {userData.isAdmin 
                    ? isMasterAdmin 
                      ? 'Administrador Mestre do Sistema' 
                      : 'Administrador do Sistema' 
                    : 'Usuário Padrão'}
                </p>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogoUpload}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {userData.logoUrl ? 'Atualizar Logotipo' : 'Adicionar Logotipo'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Painel de Administração - Visível apenas para admins */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Painel de Administração
              {isMasterAdmin && (
                <span className="ml-2 bg-juriscalc-gold text-juriscalc-navy text-xs px-2 py-1 rounded-full flex items-center">
                  <Shield className="h-3 w-3 mr-1" />
                  Admin Mestre
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allUsers.length === 0 ? (
              <p className="text-center py-8 text-gray-500">Nenhum usuário cadastrado no sistema.</p>
            ) : (
              <div className="space-y-4">
                {allUsers.map(user => (
                  <div key={user.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full overflow-hidden bg-juriscalc-lightgray flex items-center justify-center">
                        {user.logoUrl ? (
                          <img src={user.logoUrl} alt="Logo do usuário" className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-6 w-6 text-juriscalc-navy" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium">{user.nome}</h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          {user.isAdmin ? (
                            <span className="bg-juriscalc-gold text-juriscalc-navy px-2 py-1 rounded-full text-xs">
                              Admin
                            </span>
                          ) : (
                            <span className="bg-juriscalc-lightgray px-2 py-1 rounded-full text-xs">
                              Usuário
                            </span>
                          )}
                          
                          {user.canViewPanels && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              Acesso aos Painéis
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Controle de acesso aos painéis - apenas para admin mestre */}
                      {isMasterAdmin && user.id !== 'admin-1' && (
                        <div className="ml-auto flex items-center">
                          <Switch
                            checked={!!user.canViewPanels}
                            onCheckedChange={() => handleTogglePanelAccess(user.id, !!user.canViewPanels)}
                            className="data-[state=checked]:bg-green-500"
                          />
                          <span className="ml-2 text-sm">
                            {user.canViewPanels ? (
                              <span className="flex items-center text-green-600">
                                <Eye className="h-4 w-4 mr-1" />
                                Acesso permitido
                              </span>
                            ) : (
                              <span className="flex items-center text-gray-500">
                                <EyeOff className="h-4 w-4 mr-1" />
                                Sem acesso
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Dialog para upload de logotipo */}
      <Dialog open={logoDialogOpen} onOpenChange={setLogoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload de Logotipo</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full"
              />
            </div>
            
            {logoPreview && (
              <div className="mt-4 flex justify-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-juriscalc-navy">
                  <img 
                    src={logoPreview} 
                    alt="Preview do logotipo" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogoDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveLogo} disabled={!logoFile}>
              Salvar Logotipo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserManagement;
