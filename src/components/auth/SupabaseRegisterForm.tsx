
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/auth/useSupabaseAuth';

const SupabaseRegisterForm = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useSupabaseAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('As senhas não conferem');
      return;
    }
    
    setLoading(true);
    
    await signUp(email, password, nome);
    
    setLoading(false);
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
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email-register" className="block text-sm font-medium">
              E-mail
            </label>
            <Input
              id="email-register"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password-register" className="block text-sm font-medium">
              Senha
            </label>
            <Input
              id="password-register"
              type="password"
              placeholder="Crie uma senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
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
              disabled={loading}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-juriscalc-gold text-juriscalc-navy hover:bg-opacity-90"
            disabled={loading}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SupabaseRegisterForm;
