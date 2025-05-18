
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
    
    // If the user is admin or specific emails, consider them premium
    if (isAdmin || userEmail === 'johnnysantos_177@msn.com' || userEmail === 'admin@juriscalc.com') {
      setIsPremium(true);
      return;
    }
    
    // Here we could check if the user has a premium subscription in the future
    // For now we just assume they don't if they're not admin
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
