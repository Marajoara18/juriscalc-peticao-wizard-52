
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/auth/useSupabaseAuth';
import Layout from '@/components/Layout';
import HeroSection from '@/components/home/HeroSection';
import HowToUseSection from '@/components/home/HowToUseSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CTASection from '@/components/home/CTASection';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useSupabaseAuth();

  // Verificar se o usuário está logado
  useEffect(() => {
    console.log('Index page - Auth state:', { user: !!user, loading });
    
    if (!loading && !user) {
      console.log('User not authenticated, redirecting to login');
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Show loading while checking authentication
  if (loading) {
    console.log('Index page - showing loading state');
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-juriscalc-navy"></div>
        </div>
      </Layout>
    );
  }

  // If user is not authenticated, show loading (redirect will happen)
  if (!user) {
    console.log('Index page - no user, showing loading');
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-juriscalc-navy"></div>
        </div>
      </Layout>
    );
  }

  console.log('Index page - rendering main content');
  return (
    <Layout>
      <HeroSection />
      <HowToUseSection />
      <FeaturesSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
