
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { KeyRound, CheckCircle } from 'lucide-react';

// Schema de validação para o formulário
const formSchema = z.object({
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmSenha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
}).refine(data => data.senha === data.confirmSenha, {
  message: 'As senhas não conferem',
  path: ['confirmSenha'],
});

type FormValues = z.infer<typeof formSchema>;

const PasswordReset: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenChecked, setTokenChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { resetUserPassword } = useAuth();
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      senha: '',
      confirmSenha: '',
    },
  });

  // Verificar se o token e email são válidos
  useEffect(() => {
    if (!token || !email) {
      setErrorMessage('Link de redefinição inválido. Solicite um novo link.');
      setTokenChecked(true);
      return;
    }

    // Verificar se o token existe e é válido
    const resetTokens = JSON.parse(localStorage.getItem('passwordResetTokens') || '{}');
    const tokenData = resetTokens[email];
    
    if (!tokenData) {
      setErrorMessage('Token de redefinição não encontrado ou já utilizado.');
      setTokenChecked(true);
      return;
    }
    
    if (tokenData.token !== token) {
      setErrorMessage('Token de redefinição inválido.');
      setTokenChecked(true);
      return;
    }
    
    if (tokenData.expiry < Date.now()) {
      setErrorMessage('Token de redefinição expirado. Solicite um novo link.');
      
      // Remover token expirado
      delete resetTokens[email];
      localStorage.setItem('passwordResetTokens', JSON.stringify(resetTokens));
      
      setTokenChecked(true);
      return;
    }
    
    // Token válido
    setTokenValid(true);
    setTokenChecked(true);
  }, [token, email]);
  
  const onSubmit = async (data: FormValues) => {
    if (!token || !email) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await resetUserPassword(email, token, data.senha);
      if (result) {
        setResetSuccess(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRedirectToLogin = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 py-12"
         style={{ backgroundImage: "url('/lovable-uploads/6ca45eaa-5e64-4059-919a-249b086b29ae.png')" }}>
      <Card className="max-w-md w-full bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-center">Redefinição de Senha</CardTitle>
          <CardDescription className="text-center">
            {resetSuccess ? 'Senha redefinida com sucesso!' : 'Crie uma nova senha para sua conta'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!tokenChecked ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-juriscalc-navy"></div>
            </div>
          ) : errorMessage ? (
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
          ) : resetSuccess ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
              <h3 className="text-lg font-medium">Senha redefinida com sucesso!</h3>
              <p className="text-sm text-gray-500">
                Agora você pode fazer login com sua nova senha.
              </p>
              <Button 
                onClick={handleRedirectToLogin}
                className="bg-juriscalc-navy hover:bg-opacity-90 mt-4"
              >
                Ir para o Login
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex justify-center mb-4">
                  <KeyRound className="h-12 w-12 text-juriscalc-navy" />
                </div>
                
                <FormField
                  control={form.control}
                  name="senha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova Senha</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Digite sua nova senha" 
                          {...field} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmSenha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Senha</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Confirme sua nova senha" 
                          {...field} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-juriscalc-navy hover:bg-opacity-90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Salvando...' : 'Redefinir Senha'}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        {!resetSuccess && !errorMessage && (
          <CardFooter className="flex justify-center">
            <Button 
              variant="link" 
              onClick={() => window.location.href = '/'} 
              className="text-juriscalc-navy"
            >
              Voltar para o login
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default PasswordReset;
