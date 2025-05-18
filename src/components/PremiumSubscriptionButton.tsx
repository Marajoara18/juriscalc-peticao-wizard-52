
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';
import SubscriptionManager from '@/components/peticoes/SubscriptionManager';

const PremiumSubscriptionButton = () => {
  const [showSubscription, setShowSubscription] = useState(false);
  
  return (
    <>
      <Button
        onClick={() => setShowSubscription(true)}
        className="fixed bottom-6 right-6 bg-juriscalc-gold hover:bg-juriscalc-gold/90 text-juriscalc-navy shadow-lg z-40 flex items-center gap-2"
      >
        <Crown className="h-5 w-5" />
        <span>Assinar Premium</span>
      </Button>
      
      {showSubscription && (
        <SubscriptionManager onClose={() => setShowSubscription(false)} />
      )}
    </>
  );
};

export default PremiumSubscriptionButton;
