
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface ResetSuccessMessageProps {
  onRedirectToLogin: () => void;
}

export const ResetSuccessMessage: React.FC<ResetSuccessMessageProps> = ({ onRedirectToLogin }) => {
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-600" />
      </div>
      <h3 className="text-lg font-medium">Senha redefinida com sucesso!</h3>
      <p className="text-sm text-gray-500">
        Agora você pode fazer login com sua nova senha.
      </p>
      <Button 
        onClick={onRedirectToLogin}
        className="bg-juriscalc-navy hover:bg-opacity-90 mt-4"
      >
        Ir para o Login
      </Button>
    </div>
  );
};
