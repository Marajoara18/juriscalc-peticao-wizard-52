
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/auth/useSupabaseAuth';
import { toast } from 'sonner';

const SupabaseLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useSupabaseAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('LOGIN_FORM: Form submitted with:', { email, password: password ? '***' : 'empty' });
    
    if (!email || !password) {
      console.log('LOGIN_FORM: Missing email or password');
      toast.error('Preencha todos os campos');
      return;
    }

    if (!email.includes('@')) {
      console.log('LOGIN_FORM: Invalid email format');
      toast.error('Digite um e-mail válido');
      return;
    }

    setIsLoading(true);
    console.log('LOGIN_FORM: Starting sign in process for:', email);
    
    try {
      const result = await signIn(email, password);
      console.log('LOGIN_FORM: Sign in result received:', { 
        hasData: !!result?.data, 
        hasError: !!result?.error,
        errorMessage: result?.error?.message 
      });
      
      if (result?.error) {
        console.error('LOGIN_FORM: Authentication failed:', result.error);
        
        // Mensagens de erro mais específicas
        if (result.error.message === 'Invalid login credentials') {
          toast.error('E-mail ou senha incorretos. Verifique suas credenciais.');
        } else if (result.error.message?.includes('Email not confirmed')) {
          toast.error('Por favor, confirme seu e-mail antes de fazer login.');
        } else if (result.error.message?.includes('too many requests')) {
          toast.error('Muitas tentativas de login. Tente novamente em alguns minutos.');
        } else {
          toast.error('Erro ao fazer login: ' + result.error.message);
        }
      } else if (result?.data) {
        // Login bem-sucedido - mostrar mensagem de sucesso
        console.log('LOGIN_FORM: Login successful, user should be redirected automatically');
        toast.success('Login realizado com sucesso!');
        // O redirecionamento é feito automaticamente pelo useSupabaseAuth
      } else {
        console.error('LOGIN_FORM: Unexpected result format:', result);
        toast.error('Erro inesperado no login. Tente novamente.');
      }
    } catch (error) {
      console.error('LOGIN_FORM: Unexpected error during login:', error);
      toast.error('Erro inesperado no login. Tente novamente.');
    } finally {
      console.log('LOGIN_FORM: Setting loading to false');
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">Acesse sua conta</CardTitle>
        <CardDescription className="text-center">
          Entre com seus dados para acessar o sistema
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => {
                console.log('LOGIN_FORM: Email changed:', e.target.value);
                setEmail(e.target.value);
              }}
              required
              className="bg-white/80"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => {
                console.log('LOGIN_FORM: Password changed');
                setPassword(e.target.value);
              }}
              required
              className="bg-white/80"
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-juriscalc-navy hover:bg-opacity-90"
            disabled={isLoading || !email || !password}
          >
            <LogIn className="mr-2 h-4 w-4" />
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SupabaseLoginForm;
