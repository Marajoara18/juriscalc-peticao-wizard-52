
import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminDashboard from '@/components/admin/AdminDashboard';
import Layout from '@/components/Layout';

const AdminPage = () => {
  return (
    <ProtectedRoute requireAuth={true} requireAdmin={true}>
      <Layout>
        <AdminDashboard />
      </Layout>
    </ProtectedRoute>
  );
};

export default AdminPage;
