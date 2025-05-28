
import React from 'react';
import { useSupabaseAuth } from '@/hooks/auth/useSupabaseAuth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AuthDebugPanel = () => {
  const { user, profile, loading, isPremium, isAdmin } = useSupabaseAuth();

  // Só mostrar em desenvolvimento
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-white border-2 border-blue-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Debug - Estado da Autenticação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span>Loading:</span>
          <Badge variant={loading ? "destructive" : "default"}>
            {loading ? "Sim" : "Não"}
          </Badge>
        </div>
        
        <div className="flex justify-between">
          <span>User:</span>
          <Badge variant={user ? "default" : "destructive"}>
            {user ? "Logado" : "Não logado"}
          </Badge>
        </div>
        
        {user && (
          <>
            <div className="text-xs">
              <strong>ID:</strong> {user.id}
            </div>
            <div className="text-xs">
              <strong>Email:</strong> {user.email}
            </div>
          </>
        )}
        
        <div className="flex justify-between">
          <span>Profile:</span>
          <Badge variant={profile ? "default" : "destructive"}>
            {profile ? "Carregado" : "Não carregado"}
          </Badge>
        </div>
        
        {profile && (
          <>
            <div className="text-xs">
              <strong>Nome:</strong> {profile.nome_completo}
            </div>
            <div className="text-xs">
              <strong>Plano:</strong> {profile.plano_id}
            </div>
            <div className="flex justify-between">
              <span>Premium:</span>
              <Badge variant={isPremium ? "default" : "secondary"}>
                {isPremium ? "Sim" : "Não"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Admin:</span>
              <Badge variant={isAdmin ? "default" : "secondary"}>
                {isAdmin ? "Sim" : "Não"}
              </Badge>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthDebugPanel;
