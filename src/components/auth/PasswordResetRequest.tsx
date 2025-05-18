
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Mail } from 'lucide-react';

// Schema de validação para o formulário
const formSchema = z.object({
  email: z.string().email('Digite um e-mail válido'),
});

type FormValues = z.infer<typeof formSchema>;

const PasswordResetRequest: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetRequested, setResetRequested] = useState(false);
  const { requestPasswordReset } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const result = await requestPasswordReset(data.email);
      if (result) {
        setResetRequested(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 py-12"
         style={{ backgroundImage: "url('/lovable-uploads/6ca45eaa-5e64-4059-919a-249b086b29ae.png')" }}>
      <Card className="max-w-md w-full bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-center">Redefinição de Senha</CardTitle>
          <CardDescription className="text-center">
            Informe seu e-mail para receber o link de redefinição de senha
          </CardDescription>
        </CardHeader>
        <CardContent>
          {resetRequested ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Mail className="h-16 w-16 text-green-600" />
              </div>
              <h3 className="text-lg font-medium">E-mail enviado!</h3>
              <p className="text-sm text-gray-500">
                Enviamos um link de redefinição de senha para o seu e-mail.
                Verifique sua caixa de entrada e siga as instruções.
              </p>
              <p className="text-xs text-gray-400 mt-4">
                Não recebeu o e-mail? Verifique sua pasta de spam ou tente novamente.
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Digite seu e-mail" 
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
                  {isSubmitting ? 'Enviando...' : 'Enviar link de redefinição'}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            variant="link" 
            onClick={() => window.location.href = '/'} 
            className="text-juriscalc-navy"
          >
            Voltar para o login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PasswordResetRequest;
