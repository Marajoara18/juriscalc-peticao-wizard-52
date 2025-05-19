
import React from 'react';
import { Loader2 } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TokenVerificationProps {
  errorMessage: string | null;
  loading: boolean;
}

export const TokenVerification: React.FC<TokenVerificationProps> = ({ errorMessage, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-juriscalc-navy" />
        <p className="mt-4 text-sm text-gray-500">Verificando token de redefinição...</p>
      </div>
    );
  }
  
  if (errorMessage) {
    return (
      <div className="flex flex-col items-center justify-center py-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h3 className="mt-4 text-lg font-medium">Token inválido</h3>
        <p className="mt-2 text-center text-sm text-gray-500">{errorMessage}</p>
        <Button 
          onClick={() => window.location.href = '/esqueci-senha'}
          className="mt-4"
          variant="outline"
        >
          Solicitar novo link
        </Button>
        <Button 
          onClick={() => window.location.href = '/'}
          className="mt-2 w-full"
        >
          Voltar para Login
        </Button>
      </div>
    );
  }
  
  return null;
};
