
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import PremiumSubscriptionButton from './PremiumSubscriptionButton';
import { useSupabaseAuth } from '@/hooks/auth/useSupabaseAuth';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isPremium } = useSupabaseAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      
      {/* Only show the premium button for non-premium users */}
      {!isPremium && <PremiumSubscriptionButton />}
    </div>
  );
};

export default Layout;
