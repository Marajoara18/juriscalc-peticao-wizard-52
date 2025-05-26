
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/auth/useSupabaseAuth';
import { toast } from 'sonner';
import { UserPlus, Edit, Trash2 } from 'lucide-react';

interface Profile {
  id: string;
  nome: string;
  email: string;
  tipo_plano: 'padrao' | 'premium';
  tipo_usuario: 'usuario' | 'admin_mestre';
  created_at: string;
}

const UserManagement = () => {
  const { profile, isAdmin } = useSupabaseAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  
  // Formulário para novo usuário
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    nome: '',
    tipo_plano: 'padrao' as 'padrao' | 'premium',
    tipo_usuario: 'usuario' as 'usuario' | 'admin_mestre'
  });

  const fetchProfiles = async () => {
    if (!isAdmin) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    setLoading(true);
    try {
      // Criar usuário no Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUser.email,
        password: newUser.password,
        user_metadata: {
          nome: newUser.nome
        }
      });

      if (authError) throw authError;

      // Atualizar perfil
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            tipo_plano: newUser.tipo_plano,
            tipo_usuario: newUser.tipo_usuario
          })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;
      }

      toast.success('Usuário criado com sucesso!');
      setNewUser({
        email: '',
        password: '',
        nome: '',
        tipo_plano: 'padrao',
        tipo_usuario: 'usuario'
      });
      fetchProfiles();
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      toast.error('Erro ao criar usuário: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (user: Profile) => {
    if (!isAdmin) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          nome: user.nome,
          tipo_plano: user.tipo_plano,
          tipo_usuario: user.tipo_usuario
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Usuário atualizado com sucesso!');
      setEditingUser(null);
      fetchProfiles();
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      toast.error('Erro ao atualizar usuário');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!isAdmin || !confirm('Tem certeza que deseja excluir este usuário?')) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;

      toast.success('Usuário excluído com sucesso!');
      fetchProfiles();
    } catch (error: any) {
      console.error('Erro ao excluir usuário:', error);
      toast.error('Erro ao excluir usuário');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchProfiles();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Acesso Negado</CardTitle>
          <CardDescription>
            Você não tem permissão para acessar esta área.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Formulário para criar novo usuário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Criar Novo Usuário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome</label>
                <Input
                  type="text"
                  value={newUser.nome}
                  onChange={(e) => setNewUser({...newUser, nome: e.target.value})}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Senha</label>
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de Plano</label>
                <Select
                  value={newUser.tipo_plano}
                  onValueChange={(value: 'padrao' | 'premium') => 
                    setNewUser({...newUser, tipo_plano: value})
                  }
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="padrao">Padrão</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de Usuário</label>
                <Select
                  value={newUser.tipo_usuario}
                  onValueChange={(value: 'usuario' | 'admin_mestre') => 
                    setNewUser({...newUser, tipo_usuario: value})
                  }
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usuario">Usuário</SelectItem>
                    <SelectItem value="admin_mestre">Admin Mestre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Criando...' : 'Criar Usuário'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários Cadastrados</CardTitle>
          <CardDescription>
            Gerencie todos os usuários do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profiles.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  {editingUser?.id === user.id ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      <Input
                        value={editingUser.nome}
                        onChange={(e) => setEditingUser({...editingUser, nome: e.target.value})}
                        placeholder="Nome"
                      />
                      <Select
                        value={editingUser.tipo_plano}
                        onValueChange={(value: 'padrao' | 'premium') => 
                          setEditingUser({...editingUser, tipo_plano: value})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="padrao">Padrão</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={editingUser.tipo_usuario}
                        onValueChange={(value: 'usuario' | 'admin_mestre') => 
                          setEditingUser({...editingUser, tipo_usuario: value})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usuario">Usuário</SelectItem>
                          <SelectItem value="admin_mestre">Admin Mestre</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => updateUser(editingUser)}>
                          Salvar
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingUser(null)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-medium">{user.nome}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant={user.tipo_plano === 'premium' ? 'default' : 'secondary'}>
                          {user.tipo_plano === 'premium' ? 'Premium' : 'Padrão'}
                        </Badge>
                        <Badge variant={user.tipo_usuario === 'admin_mestre' ? 'destructive' : 'outline'}>
                          {user.tipo_usuario === 'admin_mestre' ? 'Admin' : 'Usuário'}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
                {editingUser?.id !== user.id && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingUser(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
