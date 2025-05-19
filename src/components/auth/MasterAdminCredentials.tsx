
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Shield, Mail, Key } from "lucide-react";
import { toast } from "sonner";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserData } from '@/types/user';

interface MasterAdminCredentialsProps {
  userData: UserData;
  allUsers: UserData[];
  updateUsers: (updatedUsers: UserData[]) => void;
}

const credentialsSchema = z.object({
  email: z.string().email('E-mail inválido'),
  currentPassword: z.string().min(1, 'A senha atual é obrigatória'),
  newPassword: z.string().min(6, 'A nova senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string().min(6, 'A confirmação da senha é obrigatória'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type CredentialsFormData = z.infer<typeof credentialsSchema>;

const MasterAdminCredentials = ({ userData, allUsers, updateUsers }: MasterAdminCredentialsProps) => {
  const [showForm, setShowForm] = useState(false);

  const form = useForm<CredentialsFormData>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      email: userData.email,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const handleUpdateCredentials = (data: CredentialsFormData) => {
    // Verificar se é o admin mestre
    if (userData.email !== 'admin@juriscalc.com' && userData.email !== 'johnnysantos_177@msn.com') {
      toast.error('Apenas o administrador mestre pode atualizar suas credenciais');
      return;
    }

    // Buscar o usuário admin no array
    const adminUserIndex = allUsers.findIndex(user => 
      user.email === 'admin@juriscalc.com' || user.email === 'johnnysantos_177@msn.com'
    );

    if (adminUserIndex === -1) {
      toast.error('Usuário administrador não encontrado');
      return;
    }

    // Verificar a senha atual
    if (allUsers[adminUserIndex].senha !== data.currentPassword) {
      toast.error('Senha atual incorreta');
      return;
    }

    // Atualizar email e senha
    const updatedUsers = [...allUsers];
    updatedUsers[adminUserIndex] = {
      ...updatedUsers[adminUserIndex],
      email: data.email,
      senha: data.newPassword
    };

    // Atualizar no localStorage também para o usuário logado
    if (userData.id === updatedUsers[adminUserIndex].id) {
      localStorage.setItem('userEmail', data.email);
    }

    // Atualizar a lista de usuários
    updateUsers(updatedUsers);
    
    toast.success('Credenciais do administrador atualizadas com sucesso!');
    setShowForm(false);
    form.reset({
      email: data.email,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-5 w-5" />
          Credenciais do Administrador Mestre
        </CardTitle>
        <Button 
          onClick={() => setShowForm(!showForm)} 
          variant="outline"
        >
          {showForm ? 'Cancelar' : 'Alterar Credenciais'}
        </Button>
      </CardHeader>
      
      {showForm && (
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateCredentials)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      E-mail do Administrador
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="admin@exemplo.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Key className="mr-2 h-4 w-4" />
                      Senha Atual
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="Digite sua senha atual" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Key className="mr-2 h-4 w-4" />
                      Nova Senha
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="Digite uma nova senha" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Key className="mr-2 h-4 w-4" />
                      Confirmar Nova Senha
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="Confirme sua nova senha" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full mt-4">
                Atualizar Credenciais
              </Button>
            </form>
          </Form>
        </CardContent>
      )}
    </Card>
  );
};

export default MasterAdminCredentials;
