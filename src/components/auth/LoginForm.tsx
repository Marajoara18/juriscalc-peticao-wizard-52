
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { LoginFormData } from '@/types/auth';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, senha });
  };

  return (
    <Card>
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
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="senha" className="block text-sm font-medium">
              Senha
            </label>
            <Input
              id="senha"
              type="password"
              placeholder="Sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-juriscalc-navy hover:bg-opacity-90">
            <LogIn className="mr-2 h-4 w-4" />
            Entrar
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
