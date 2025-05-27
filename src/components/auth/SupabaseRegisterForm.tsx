
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register form submitted with:', { nome, email, password: password ? '***' : 'empty' });
    
    if (!nome || !email || !password || !confirmPassword) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (!email.includes('@')) {
      toast.error('Digite um e-mail válido');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('As senhas não conferem');
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    console.log('Starting sign up process...');
    
    try {
      const result = await signUp(email, password, nome);
      console.log('Sign up result:', result);
      
      if (result?.error) {
        console.error('Sign up error:', result.error);
        toast.error('Erro ao criar conta. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      toast.error('Erro inesperado no cadastro');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = nome && email && password && confirmPassword && password.length >= 6;

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
              Nome Completo
            </label>
            <Input
              id="nome"
              type="text"
              placeholder="Seu nome completo"
              value={nome}
              onChange={(e) => {
                console.log('Nome changed:', e.target.value);
                setNome(e.target.value);
              }}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email-cadastro" className="block text-sm font-medium">
              E-mail
            </label>
            <Input
              id="email-cadastro"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => {
                console.log('Email changed:', e.target.value);
                setEmail(e.target.value);
              }}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password-cadastro" className="block text-sm font-medium">
              Senha
            </label>
            <Input
              id="password-cadastro"
              type="password"
              placeholder="Crie uma senha"
              value={password}
              onChange={(e) => {
                console.log('Password changed');
                setPassword(e.target.value);
              }}
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirm-password" className="block text-sm font-medium">
              Confirmar Senha
            </label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => {
                console.log('Confirm password changed');
                setConfirmPassword(e.target.value);
              }}
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-juriscalc-gold text-juriscalc-navy hover:bg-opacity-90"
            disabled={isLoading || !isFormValid}
            onClick={(e) => {
              console.log('Register button clicked');
              // Form onSubmit will handle the logic
            }}
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
