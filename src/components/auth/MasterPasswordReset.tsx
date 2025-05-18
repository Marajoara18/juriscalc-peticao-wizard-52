
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { KeyRound, MailIcon, CheckCircle } from 'lucide-react';

// Schema de validação para o formulário de redefinição de senha
const resetPasswordSchema = z.object({
  novaSenha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmarSenha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
}).refine(data => data.novaSenha === data.confirmarSenha, {
  message: 'As senhas não conferem',
  path: ['confirmarSenha'],
});

type FormValues = z.infer<typeof resetPasswordSchema>;

const MasterPasswordReset: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [tokenConfirmed, setTokenConfirmed] = useState(false);
  
  // Email do administrador mestre
  const masterEmail = "johnnysantos_177@msn.com";
  
  // Form para redefinição de senha
  const form = useForm<FormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      novaSenha: '',
      confirmarSenha: ''
    }
  });
  
  const handleSendResetLink = async () => {
    setLoading(true);
    
    try {
      // Simulação do envio de email
      // Em uma aplicação real, isso chamaria uma API para enviar o email
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Gerar um token de redefinição e armazenar no localStorage
      const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('masterResetToken', resetToken);
      localStorage.setItem('masterResetTokenExpiry', (Date.now() + 3600000).toString()); // Token válido por 1 hora
      
      // Notificar o usuário que o email foi enviado
      toast.success(`Link para redefinição de senha enviado para ${masterEmail}`);
      
      // Em um caso real, o email enviaria o link com o token
      console.log(`Link de redefinição: ${window.location.origin}/reset-password?token=${resetToken}`);
      
      // Armazenar no localStorage que o link foi enviado (para demonstração)
      localStorage.setItem('passwordResetSent', 'true');
      setLinkSent(true);

      // Abrir diálogo para informar que o link foi enviado
      setDialogOpen(true);
    } catch (error) {
      toast.error('Ocorreu um erro ao enviar o link de redefinição de senha.');
      console.error('Erro ao enviar link:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSimulateTokenConfirm = () => {
    setTokenConfirmed(true);
    setDialogOpen(false);
  }
  
  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    
    try {
      // Simulação da redefinição de senha
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Atualizar a senha do administrador master no localStorage
      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      const masterIndex = allUsers.findIndex((u: any) => u.email === masterEmail);
      
      if (masterIndex >= 0) {
        allUsers[masterIndex].senha = data.novaSenha;
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
        toast.success('Senha do administrador master atualizada com sucesso!');
        
        // Limpar tokens de redefinição
        localStorage.removeItem('masterResetToken');
        localStorage.removeItem('masterResetTokenExpiry');
        setTokenConfirmed(false);
        setLinkSent(false);
      } else {
        toast.error('Usuário administrador master não encontrado.');
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao redefinir a senha.');
      console.error('Erro ao redefinir senha:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Verificar se o usuário atual é o administrador master
  const isMasterAdmin = localStorage.getItem('userIsAdmin') === 'true';
  const userEmail = localStorage.getItem('userEmail');
  const isActualMasterAdmin = userEmail === masterEmail || userEmail === "admin@juriscalc.com";
  
  if (!isMasterAdmin && !isActualMasterAdmin) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-5 w-5" />
          Redefinir Senha Master
        </CardTitle>
        <CardDescription>
          Envie um link de redefinição de senha para o email do administrador master
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <p className="text-sm text-gray-500">
            Um link seguro será enviado para o email {masterEmail} para redefinir a senha de administrador master.
          </p>
          
          {linkSent && tokenConfirmed && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="novaSenha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Digite a nova senha" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmarSenha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Confirme a nova senha" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  disabled={loading || !form.formState.isValid}
                  className="w-full bg-juriscalc-navy hover:bg-opacity-90"
                >
                  {loading ? 'Salvando...' : 'Salvar Nova Senha'}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {!linkSent && (
          <Button 
            onClick={handleSendResetLink} 
            disabled={loading}
            className="w-full bg-juriscalc-navy hover:bg-opacity-90 flex items-center gap-2"
          >
            <MailIcon className="h-4 w-4" />
            {loading ? 'Enviando...' : 'Enviar Link de Redefinição'}
          </Button>
        )}
        
        {linkSent && !tokenConfirmed && (
          <Button 
            onClick={handleSimulateTokenConfirm} 
            className="w-full bg-green-600 hover:bg-green-700 flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Simular Confirmação do Link
          </Button>
        )}
      </CardFooter>
      
      {/* Diálogo para informar que o link foi enviado */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link Enviado</DialogTitle>
            <DialogDescription>
              Um link de redefinição de senha foi enviado para {masterEmail}. Verifique sua caixa de entrada e clique no link para redefinir sua senha.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <MailIcon className="h-16 w-16 text-blue-500" />
          </div>
          <p className="text-center text-sm text-gray-500">
            Para fins de demonstração, você pode simular a confirmação do link clicando no botão abaixo.
          </p>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setDialogOpen(false)} variant="outline" className="mr-2">
              Fechar
            </Button>
            <Button onClick={handleSimulateTokenConfirm}>
              Simular Confirmação
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default MasterPasswordReset;
