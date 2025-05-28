
import React from 'react';
import Layout from '@/components/Layout';
import { useSupabaseAuth } from '@/hooks/auth/useSupabaseAuth';
import UserManagement from '@/components/admin/UserManagement';
import TestModeManager from '@/components/admin/TestModeManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield } from 'lucide-react';

const AdminPanel = () => {
  const { isAdmin, loading } = useSupabaseAuth();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-juriscalc-navy"></div>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="container mx-auto py-10 px-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Acesso Negado
              </CardTitle>
              <CardDescription>
                Você não tem permissão para acessar o painel administrativo.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-juriscalc-navy mb-2">
            Painel Administrativo
          </h1>
          <p className="text-gray-600">
            Gerencie usuários, configurações e modo de teste do sistema
          </p>
        </div>
        
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="test-mode">Modo de Teste</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="test-mode">
            <div className="flex justify-center">
              <TestModeManager />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminPanel;
