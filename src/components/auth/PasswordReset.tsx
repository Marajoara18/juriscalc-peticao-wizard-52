
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TokenVerification } from './reset-password/TokenVerification';
import { ResetPasswordForm, ResetPasswordFormValues } from './reset-password/ResetPasswordForm';
import { ResetSuccessMessage } from './reset-password/ResetSuccessMessage';

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
  
  const onSubmit = async (data: ResetPasswordFormValues) => {
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
          <TokenVerification
            errorMessage={errorMessage}
            loading={!tokenChecked}
          />
          
          {tokenChecked && !errorMessage && !resetSuccess && tokenValid && (
            <ResetPasswordForm 
              onSubmit={onSubmit} 
              isSubmitting={isSubmitting} 
            />
          )}
          
          {resetSuccess && (
            <ResetSuccessMessage onRedirectToLogin={handleRedirectToLogin} />
          )}
        </CardContent>
        {!resetSuccess && !errorMessage && tokenValid && (
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
