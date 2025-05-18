
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import PremiumSubscriptionButton from './PremiumSubscriptionButton';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isPremium, setIsPremium] = useState<boolean>(false);
  
  // Check if the user is premium
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    const isAdmin = localStorage.getItem('userIsAdmin') === 'true';
    
    // Verificar acesso premium diretamente do localStorage para garantir atualização em tempo real
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const currentUser = allUsers.find((u: any) => u.id === userId);
    
    // Se for admin mestre ou tiver marcado como premium, considere-o premium
    if (isAdmin || 
        userEmail === 'johnnysantos_177@msn.com' || 
        userEmail === 'admin@juriscalc.com' ||
        (currentUser && currentUser.isPremium)) {
      setIsPremium(true);
      return;
    }
    
    setIsPremium(false);
  }, []);
  
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
