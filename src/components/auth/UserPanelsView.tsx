
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
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Ação</TableHead>
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
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewUserPanel(user.id)}
                    className="text-juriscalc-navy border-juriscalc-navy"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver Painéis
                  </Button>
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
