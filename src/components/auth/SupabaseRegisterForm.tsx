
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/auth/useSupabaseAuth';
import { toast } from 'sonner';

const SupabaseRegisterForm = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useSupabaseAuth();

  const validateForm = () => {
    if (!nome || nome.trim().length < 2) {
      toast.error('Nome deve ter pelo menos 2 caracteres');
      return false;
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
      toast.error('Digite um e-mail válido (ex: usuario@exemplo.com)');
      return false;
    }

    if (!password || password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return false;
    }

    if (password !== confirmPassword) {
      toast.error('As senhas não conferem. Digite a mesma senha nos dois campos');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('REGISTER: Form submitted with:', { 
      nome: nome.trim(), 
      email: email.trim().toLowerCase(), 
      password: password ? '***' : 'empty',
      confirmPassword: confirmPassword ? '***' : 'empty'
    });
    
    if (!validateForm()) {
      console.log('REGISTER: Form validation failed');
      return;
    }

    setIsLoading(true);
    console.log('REGISTER: Starting sign up process...');
    
    try {
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedNome = nome.trim();
      
      console.log('REGISTER: Calling signUp with:', { email: trimmedEmail, nome: trimmedNome });
      const result = await signUp(trimmedEmail, password, trimmedNome);
      console.log('REGISTER: Sign up result:', { 
        hasData: !!result?.data, 
        hasError: !!result?.error,
        errorMessage: result?.error?.message,
        errorCode: result?.error?.code
      });
      
      if (result?.error) {
        console.error('REGISTER: Sign up error details:', {
          message: result.error.message,
          code: result.error.code,
          status: result.error.status
        });
        
        // Mensagens de erro mais específicas e detalhadas
        if (result.error.message?.includes('User already registered') || 
            result.error.message?.includes('already been registered') ||
            result.error.code === '23505') {
          toast.error('Este e-mail já está cadastrado. Use outro e-mail ou faça login.');
        } else if (result.error.message?.includes('Invalid email')) {
          toast.error('E-mail inválido. Verifique o formato (ex: usuario@exemplo.com).');
        } else if (result.error.message?.includes('Password should be at least 6 characters')) {
          toast.error('A senha deve ter pelo menos 6 caracteres.');
        } else if (result.error.message?.includes('Signup is disabled')) {
          toast.error('Cadastro temporariamente desabilitado. Tente novamente mais tarde.');
        } else if (result.error.message?.includes('Email rate limit exceeded')) {
          toast.error('Muitas tentativas de cadastro. Aguarde alguns minutos e tente novamente.');
        } else {
          console.error('REGISTER: Unhandled error:', result.error);
          toast.error(`Erro no cadastro: ${result.error.message || 'Erro desconhecido'}. Tente novamente.`);
        }
      } else if (result?.data) {
        // Cadastro bem-sucedido
        console.log('REGISTER: Account creation successful');
        toast.success('Conta criada com sucesso! Verifique seu e-mail para confirmar.');
        
        // Limpar campos após sucesso
        setNome('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        console.error('REGISTER: Unexpected result format:', result);
        toast.error('Resposta inesperada do servidor. Tente novamente.');
      }
    } catch (error: any) {
      console.error('REGISTER: Unexpected error during registration:', {
        message: error?.message,
        stack: error?.stack,
        error
      });
      toast.error('Erro inesperado no cadastro. Verifique sua conexão e tente novamente.');
    } finally {
      setIsLoading(false);
      console.log('REGISTER: Process completed, loading set to false');
    }
  };

  const isFormValid = nome.trim().length >= 2 && 
                     email.includes('@') && 
                     email.includes('.') && 
                     password.length >= 6 && 
                     confirmPassword.length >= 6 &&
                     password === confirmPassword;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Crie sua conta</CardTitle>
        <CardDescription className="text-center">
          Preencha os dados abaixo para se cadastrar
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="nome" className="block text-sm font-medium">
              Nome Completo *
            </label>
            <Input
              id="nome"
              type="text"
              placeholder="Seu nome completo"
              value={nome}
              onChange={(e) => {
                console.log('REGISTER: Nome changed:', e.target.value);
                setNome(e.target.value);
              }}
              required
              disabled={isLoading}
              minLength={2}
              className={nome.trim().length > 0 && nome.trim().length < 2 ? 'border-red-500' : ''}
            />
            {nome.trim().length > 0 && nome.trim().length < 2 && (
              <p className="text-xs text-red-500">Nome deve ter pelo menos 2 caracteres</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="email-cadastro" className="block text-sm font-medium">
              E-mail *
            </label>
            <Input
              id="email-cadastro"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => {
                console.log('REGISTER: Email changed:', e.target.value);
                setEmail(e.target.value);
              }}
              required
              disabled={isLoading}
              className={email.length > 0 && (!email.includes('@') || !email.includes('.')) ? 'border-red-500' : ''}
            />
            {email.length > 0 && (!email.includes('@') || !email.includes('.')) && (
              <p className="text-xs text-red-500">Digite um e-mail válido</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="password-cadastro" className="block text-sm font-medium">
              Senha *
            </label>
            <Input
              id="password-cadastro"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => {
                console.log('REGISTER: Password changed, length:', e.target.value.length);
                setPassword(e.target.value);
              }}
              required
              disabled={isLoading}
              minLength={6}
              className={password.length > 0 && password.length < 6 ? 'border-red-500' : ''}
            />
            {password.length > 0 && password.length < 6 && (
              <p className="text-xs text-red-500">Senha deve ter pelo menos 6 caracteres</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="confirm-password" className="block text-sm font-medium">
              Confirmar Senha *
            </label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => {
                console.log('REGISTER: Confirm password changed');
                setConfirmPassword(e.target.value);
              }}
              required
              disabled={isLoading}
              minLength={6}
              className={confirmPassword.length > 0 && password !== confirmPassword ? 'border-red-500' : ''}
            />
            {confirmPassword.length > 0 && password !== confirmPassword && (
              <p className="text-xs text-red-500">As senhas não conferem</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-juriscalc-gold text-juriscalc-navy hover:bg-opacity-90"
            disabled={isLoading || !isFormValid}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SupabaseRegisterForm;
