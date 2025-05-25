
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Profile {
  id: string;
  nome: string;
  email: string;
  tipo_plano: 'padrao' | 'premium';
  tipo_usuario: 'usuario' | 'admin_mestre';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export const useAdminManagement = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllProfiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to ensure data matches our interface
      const typedData = (data || []).map(profile => ({
        ...profile,
        tipo_plano: profile.tipo_plano as 'padrao' | 'premium',
        tipo_usuario: profile.tipo_usuario as 'usuario' | 'admin_mestre'
      }));
      
      setProfiles(typedData);
    } catch (error: any) {
      toast.error('Erro ao carregar usuários: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProfiles();
  }, []);

  const updateUserPlan = async (userId: string, newPlan: 'padrao' | 'premium') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ tipo_plano: newPlan })
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      setProfiles(prev => 
        prev.map(profile => 
          profile.id === userId 
            ? { ...profile, tipo_plano: newPlan }
            : profile
        )
      );

      toast.success('Plano do usuário atualizado com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao atualizar plano: ' + error.message);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // First delete the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) throw profileError;

      // Then delete the auth user (this requires admin privileges)
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      
      if (authError) {
        console.warn('Could not delete auth user:', authError);
        // Continue anyway as the profile was deleted
      }

      // Update local state
      setProfiles(prev => prev.filter(profile => profile.id !== userId));
      
      toast.success('Usuário excluído com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao excluir usuário: ' + error.message);
    }
  };

  const createMasterAdmin = async (email: string) => {
    try {
      // First check if user already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (existingProfile) {
        // Update existing user to admin
        const { error } = await supabase
          .from('profiles')
          .update({ 
            tipo_usuario: 'admin_mestre',
            tipo_plano: 'premium'
          })
          .eq('email', email);

        if (error) throw error;
        
        toast.success('Usuário promovido a administrador mestre!');
        fetchAllProfiles();
      } else {
        toast.error('Usuário não encontrado. O usuário deve se cadastrar primeiro.');
      }
    } catch (error: any) {
      toast.error('Erro ao criar administrador: ' + error.message);
    }
  };

  return {
    profiles,
    loading,
    fetchAllProfiles,
    updateUserPlan,
    deleteUser,
    createMasterAdmin
  };
};
