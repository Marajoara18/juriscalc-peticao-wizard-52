
import React from 'react';
import Layout from '@/components/Layout';
import { useSupabaseAuth } from '@/hooks/auth/useSupabaseAuth';
import UserManagement from '@/components/admin/UserManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
            Gerencie usuários e configurações do sistema
          </p>
        </div>
        
        <UserManagement />
      </div>
    </Layout>
  );
};

export default AdminPanel;
