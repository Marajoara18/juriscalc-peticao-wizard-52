
import React from 'react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/home/HeroSection';
import HowToUseSection from '@/components/home/HowToUseSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CTASection from '@/components/home/CTASection';

const Index = () => {
  console.log('INDEX: Renderizando conteúdo principal da home');
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
