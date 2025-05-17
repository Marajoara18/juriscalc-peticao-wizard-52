
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserData } from '@/types/user';
import { Eye, Shield, PanelLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

interface UserPanelsViewProps {
  isMasterAdmin: boolean;
  allUsers: UserData[];
}

const UserPanelsView = ({ isMasterAdmin, allUsers }: UserPanelsViewProps) => {
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    setCurrentUserId(userId);
  }, []);

  if (!isMasterAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Acesso Restrito</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Você não tem permissão para visualizar esta área.</p>
        </CardContent>
      </Card>
    );
  }

  const handleViewUserPanel = (userId: string) => {
    // Salva o ID do usuário original
    localStorage.setItem('originalUserId', currentUserId || '');
    
    // Salva os dados do usuário que está sendo visualizado
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      localStorage.setItem('viewingAsUserId', userId);
      localStorage.setItem('viewingAsUserName', user.nome);
      localStorage.setItem('viewingAsUserEmail', user.email);
      
      toast.success(`Visualizando como ${user.nome}`);
      navigate('/calculadora');
    }
  };

  const handleLoginAsUser = (userId: string) => {
    // Salva o ID do usuário original
    localStorage.setItem('originalUserId', currentUserId || '');
    
    // Salva os dados do usuário que está sendo visualizado
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      // Armazena as credenciais originais do admin
      const adminId = localStorage.getItem('userId');
      const adminEmail = localStorage.getItem('userEmail');
      const adminName = localStorage.getItem('userName');
      
      localStorage.setItem('adminOriginalId', adminId || '');
      localStorage.setItem('adminOriginalEmail', adminEmail || '');
      localStorage.setItem('adminOriginalName', adminName || '');
      
      // Define as credenciais do usuário
      localStorage.setItem('userId', userId);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userName', user.nome);
      localStorage.setItem('userIsAdmin', String(user.isAdmin));
      if (user.logoUrl) {
        localStorage.setItem('userLogoUrl', user.logoUrl);
      }
      
      toast.success(`Login como ${user.nome} realizado com sucesso!`);
      navigate('/calculadora');
    }
  };

  const handleStopViewingAs = () => {
    const originalUserId = localStorage.getItem('originalUserId');
    if (originalUserId) {
      localStorage.removeItem('viewingAsUserId');
      localStorage.removeItem('viewingAsUserName');
      localStorage.removeItem('viewingAsUserEmail');
      localStorage.removeItem('originalUserId');
      
      toast.success('Retornando à visualização normal');
      navigate('/peticoes');
    }
  };

  // Verificar se admin está visualizando como outro usuário
  const isViewingAs = localStorage.getItem('viewingAsUserId') !== null;

  // Verificar se admin está logado como outro usuário
  const isLoggedInAsUser = localStorage.getItem('adminOriginalId') !== null;

  // Botão para retornar ao admin original
  const handleReturnToAdmin = () => {
    const adminId = localStorage.getItem('adminOriginalId');
    const adminEmail = localStorage.getItem('adminOriginalEmail');
    const adminName = localStorage.getItem('adminOriginalName');
    
    if (adminId && adminEmail) {
      // Restaurar credenciais do admin
      localStorage.setItem('userId', adminId);
      localStorage.setItem('userEmail', adminEmail);
      localStorage.setItem('userName', adminName || 'Administrador');
      localStorage.setItem('userIsAdmin', 'true');
      
      // Limpar dados temporários
      localStorage.removeItem('adminOriginalId');
      localStorage.removeItem('adminOriginalEmail');
      localStorage.removeItem('adminOriginalName');
      
      toast.success('Retornando à conta de administrador');
      navigate('/peticoes');
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <PanelLeft className="mr-2 h-5 w-5" />
          Visualização de Painéis de Usuários
          <span className="ml-2 bg-juriscalc-gold text-juriscalc-navy text-xs px-2 py-1 rounded-full flex items-center">
            <Shield className="h-3 w-3 mr-1" />
            Recurso Admin Mestre
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {isViewingAs && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded-md">
            <p className="text-yellow-800 mb-2">
              Você está visualizando o sistema como outro usuário. 
            </p>
            <Button 
              variant="outline" 
              onClick={handleStopViewingAs}
              className="text-yellow-800 border-yellow-500 hover:bg-yellow-100"
            >
              Voltar à visualização normal
            </Button>
          </div>
        )}
        
        {isLoggedInAsUser && (
          <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-md">
            <p className="text-red-800 mb-2">
              Você está logado como outro usuário. 
            </p>
            <Button 
              variant="outline" 
              onClick={handleReturnToAdmin}
              className="text-red-800 border-red-500 hover:bg-red-100"
            >
              Voltar para conta de administrador
            </Button>
          </div>
        )}
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allUsers.filter(user => user.id !== currentUserId).map(user => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.nome}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.isAdmin ? (
                    <span className="bg-juriscalc-gold text-juriscalc-navy px-2 py-1 rounded-full text-xs">
                      Admin
                    </span>
                  ) : (
                    <span className="bg-juriscalc-lightgray px-2 py-1 rounded-full text-xs">
                      Usuário
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewUserPanel(user.id)}
                      className="text-juriscalc-navy border-juriscalc-navy"
                      title="Visualizar como este usuário (apenas interface)"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Como
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleLoginAsUser(user.id)}
                      className="bg-juriscalc-navy text-white"
                      title="Entrar com a conta deste usuário"
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      Entrar Como
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserPanelsView;
