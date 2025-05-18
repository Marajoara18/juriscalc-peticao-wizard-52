
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

interface AdminSessionIndicatorProps {
  isLoggedInAsUser: boolean;
  onReturnToAdmin: () => void;
}

const AdminSessionIndicator = ({ isLoggedInAsUser, onReturnToAdmin }: AdminSessionIndicatorProps) => {
  if (!isLoggedInAsUser) return null;
  
  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-md">
      <p className="font-medium text-red-800 mb-2">
        <Shield className="inline-block mr-2 h-4 w-4" />
        Você está logado como outro usuário (modo admin)
      </p>
      <Button 
        variant="outline" 
        onClick={onReturnToAdmin}
        className="text-red-800 border-red-500 hover:bg-red-100"
      >
        Retornar à conta de administrador
      </Button>
    </div>
  );
};

export default AdminSessionIndicator;
