
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import PremiumSubscriptionButton from './PremiumSubscriptionButton';
import AuthDebugPanel from './auth/AuthDebugPanel';
import { useSupabaseAuthOnly } from '@/hooks/auth/useSupabaseAuthOnly';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, profile } = useSupabaseAuthOnly();
  const [showPremiumButton, setShowPremiumButton] = useState(true);
  
  useEffect(() => {
    if (!user) {
      setShowPremiumButton(true);
      return;
    }

    // Verificar acesso premium via Supabase profile apenas
    const isPremiumProfile = profile?.plano_id === 'premium_mensal' || 
                            profile?.plano_id === 'premium_anual' || 
                            profile?.plano_id === 'admin';
    
    console.log('LAYOUT: Premium check:', {
      userId: user.id,
      userEmail: user.email,
      isPremiumProfile,
      planId: profile?.plano_id
    });
    
    setShowPremiumButton(!isPremiumProfile);
  }, [user, profile]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      
      {/* Only show the premium button for non-premium users */}
      {showPremiumButton && <PremiumSubscriptionButton />}
      
      {/* Debug panel - só aparece em desenvolvimento */}
      <AuthDebugPanel />
    </div>
  );
};

export default Layout;
