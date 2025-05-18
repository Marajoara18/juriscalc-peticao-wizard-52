
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface TokenVerificationProps {
  errorMessage: string | null;
  loading: boolean;
}

export const TokenVerification: React.FC<TokenVerificationProps> = ({ 
  errorMessage, 
  loading 
}) => {
  const navigate = useNavigate();
  
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-juriscalc-navy"></div>
      </div>
    );
  }
  
  if (errorMessage) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <Button onClick={() => navigate('/esqueci-senha')} className="mt-4">
            Solicitar novo link
          </Button>
        </div>
      </div>
    );
  }
  
  return null;
};
