
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSupabaseAuth } from '@/hooks/auth/useSupabaseAuth';
import { ArrowLeft, Mail } from 'lucide-react';

const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useSupabaseAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await resetPassword(email);
    
    if (!result.error) {
      setSent(true);
    }
    
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-juriscalc-blue via-juriscalc-navy to-juriscalc-gold flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <Mail className="h-5 w-5" />
                Email Enviado
              </CardTitle>
              <CardDescription className="text-center">
                Verifique sua caixa de entrada e clique no link para redefinir sua senha.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar ao Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-juriscalc-blue via-juriscalc-navy to-juriscalc-gold flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Esqueceu sua senha?</CardTitle>
            <CardDescription className="text-center">
              Digite seu email para receber um link de redefinição de senha
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
                  disabled={loading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-juriscalc-navy hover:bg-opacity-90"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar Link de Redefinição'}
              </Button>
              <Link to="/">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar ao Login
                </Button>
              </Link>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PasswordResetRequest;
