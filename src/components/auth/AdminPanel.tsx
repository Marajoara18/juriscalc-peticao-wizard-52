
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Users, User, Eye, EyeOff, Shield } from "lucide-react";
import { toast } from "sonner";

interface UserData {
  id: string;
  nome: string;
  email: string;
  isAdmin: boolean;
  logoUrl?: string;
  canViewPanels?: boolean;
}

interface AdminPanelProps {
  isMasterAdmin: boolean;
  allUsers: UserData[];
  updateUsers: (updatedUsers: UserData[]) => void;
}

const AdminPanel = ({ isMasterAdmin, allUsers, updateUsers }: AdminPanelProps) => {
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
    
    updateUsers(updatedUsers);
    
    const userName = updatedUsers.find(user => user.id === userId)?.nome;
    toast.success(`Permissões de ${userName} atualizadas com sucesso!`);
  };

  return (
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
  );
};

export default AdminPanel;
