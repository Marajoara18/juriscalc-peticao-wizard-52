
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { KeyRound } from 'lucide-react';

// Schema de validação para o formulário
const formSchema = z.object({
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmSenha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
}).refine(data => data.senha === data.confirmSenha, {
  message: 'As senhas não conferem',
  path: ['confirmSenha'],
});

export type ResetPasswordFormValues = z.infer<typeof formSchema>;

interface ResetPasswordFormProps {
  onSubmit: (data: ResetPasswordFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onSubmit, isSubmitting }) => {
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      senha: '',
      confirmSenha: '',
    },
  });

  return (
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
  );
};
