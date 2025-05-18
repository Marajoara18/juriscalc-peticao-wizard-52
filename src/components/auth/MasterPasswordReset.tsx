
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const MasterPasswordReset: React.FC = () => {
  const [loading, setLoading] = useState(false);
  
  // Email do administrador mestre
  const masterEmail = "johnnysantos_177@msn.com";
  
  const handleSendResetLink = async () => {
    setLoading(true);
    
    try {
      // Simulação do envio de email
      // Em uma aplicação real, isso chamaria uma API para enviar o email
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Notificar o usuário que o email foi enviado
      toast.success(`Link para redefinição de senha enviado para ${masterEmail}`);
      
      // Armazenar no localStorage que o link foi enviado (para demonstração)
      localStorage.setItem('passwordResetSent', 'true');
    } catch (error) {
      toast.error('Ocorreu um erro ao enviar o link de redefinição de senha.');
      console.error('Erro ao enviar link:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Verificar se o usuário atual é o administrador master
  const isMasterAdmin = localStorage.getItem('userIsAdmin') === 'true';
  
  if (!isMasterAdmin) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Redefinir Senha Master</CardTitle>
        <CardDescription>
          Envie um link de redefinição de senha para o email do administrador master
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <p className="text-sm text-gray-500">
            Um link seguro será enviado para o email {masterEmail} para redefinir a senha de administrador master.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSendResetLink} 
          disabled={loading}
          className="w-full bg-juriscalc-navy hover:bg-opacity-90"
        >
          {loading ? 'Enviando...' : 'Enviar Link de Redefinição'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MasterPasswordReset;
