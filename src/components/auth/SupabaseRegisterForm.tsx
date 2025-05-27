
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
    
    if (!nome || !email || !password || !confirmPassword) {
      toast.error('Preencha todos os campos');
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
    
    try {
      await signUp(email, password, nome);
    } catch (error) {
      console.error('Erro no cadastro:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
              onChange={(e) => setNome(e.target.value)}
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
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
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
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            disabled={isLoading}
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
