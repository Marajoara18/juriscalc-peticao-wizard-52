
import React from 'react';
import { Star, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SubscriptionBadges from './SubscriptionBadges';

interface PremiumPlanCardProps {
  onSubscribe: () => void;
}

const PremiumPlanCard: React.FC<PremiumPlanCardProps> = ({ onSubscribe }) => {
  return (
    <div className="border-t border-gray-200 pt-6 mt-4">
      <div className="bg-gradient-to-r from-juriscalc-navy to-blue-800 p-5 rounded-lg text-white mb-4 shadow-lg">
        <div className="flex items-center mb-3">
          <Star className="h-5 w-5 text-juriscalc-gold mr-2" />
          <h3 className="text-lg font-bold">Plano Premium</h3>
        </div>
        <p className="text-sm mb-3">
          Desbloqueie recursos avançados e aumente sua produtividade:
        </p>
        <ul className="text-sm space-y-2 mb-4">
          <li className="flex items-start">
            <Check className="h-4 w-4 text-juriscalc-gold mr-1 mt-0.5 flex-shrink-0" />
            <span>Cálculos ilimitados</span>
          </li>
          <li className="flex items-start">
            <Check className="h-4 w-4 text-juriscalc-gold mr-1 mt-0.5 flex-shrink-0" />
            <span>Suporte prioritário</span>
          </li>
          <li className="flex items-start">
            <Check className="h-4 w-4 text-juriscalc-gold mr-1 mt-0.5 flex-shrink-0" />
            <span>Compartilhamento via WhatsApp, e-mail e exportação PDF/Excel</span>
          </li>
        </ul>
        <Button 
          className="w-full bg-juriscalc-gold text-juriscalc-navy hover:bg-juriscalc-gold/90 shadow-md transition-all duration-300"
          onClick={onSubscribe}
        >
          <Star className="mr-2 h-4 w-4" />
          Assinar Premium
        </Button>
      </div>
      
      <SubscriptionBadges />
    </div>
  );
};

export default PremiumPlanCard;
