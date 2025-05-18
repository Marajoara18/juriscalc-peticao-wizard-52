
import { toast } from 'sonner';
import { User } from '@/types/auth';

export const usePasswordReset = () => {
  const resetMasterPassword = async (email: string, newPassword: string) => {
    if (email !== 'johnnysantos_177@msn.com' && email !== 'admin@juriscalc.com') {
      toast.error('Apenas o administrador master pode redefinir a senha master.');
      return false;
    }
    
    try {
      // Buscar usuários do localStorage
      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      
      // Encontrar o usuário do admin master
      const adminIndex = allUsers.findIndex((u: User) => 
        u.email === 'johnnysantos_177@msn.com' || u.email === 'admin@juriscalc.com'
      );
      
      if (adminIndex >= 0) {
        // Atualizar a senha
        allUsers[adminIndex].senha = newPassword;
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
        
        toast.success('Senha do administrador master redefinida com sucesso!');
        return true;
      } else {
        toast.error('Usuário administrador master não encontrado.');
        return false;
      }
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      toast.error('Ocorreu um erro ao redefinir a senha do administrador master.');
      return false;
    }
  };

  // Função para solicitar redefinição de senha para usuários comuns
  const requestPasswordReset = async (email: string) => {
    try {
      // Buscar usuários do localStorage
      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      
      // Encontrar o usuário com o email informado
      const userExists = allUsers.some((u: User) => u.email === email);
      
      if (!userExists) {
        toast.error('E-mail não encontrado em nosso sistema.');
        return false;
      }
      
      // Gerar token de redefinição
      const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const expiry = Date.now() + 3600000; // Token válido por 1 hora
      
      // Armazenar o token no localStorage (simulando o armazenamento no banco de dados)
      const resetTokens = JSON.parse(localStorage.getItem('passwordResetTokens') || '{}');
      resetTokens[email] = {
        token: resetToken,
        expiry: expiry
      };
      localStorage.setItem('passwordResetTokens', JSON.stringify(resetTokens));
      
      // Simulação do envio de email (na vida real, isso seria feito por um serviço de envio de emails)
      console.log(`Link de redefinição para ${email}: ${window.location.origin}/reset-senha?token=${resetToken}&email=${encodeURIComponent(email)}`);
      
      toast.success(`Link de redefinição de senha enviado para ${email}`);
      return true;
    } catch (error) {
      console.error('Erro ao solicitar redefinição de senha:', error);
      toast.error('Ocorreu um erro ao solicitar a redefinição de senha.');
      return false;
    }
  };
  
  // Função para redefinir a senha do usuário com o token
  const resetUserPassword = async (email: string, token: string, newPassword: string) => {
    try {
      // Verificar se o token é válido
      const resetTokens = JSON.parse(localStorage.getItem('passwordResetTokens') || '{}');
      const tokenData = resetTokens[email];
      
      if (!tokenData) {
        toast.error('Token de redefinição inválido ou expirado.');
        return false;
      }
      
      if (tokenData.token !== token) {
        toast.error('Token de redefinição inválido.');
        return false;
      }
      
      if (tokenData.expiry < Date.now()) {
        toast.error('Token de redefinição expirado.');
        
        // Remover token expirado
        delete resetTokens[email];
        localStorage.setItem('passwordResetTokens', JSON.stringify(resetTokens));
        
        return false;
      }
      
      // Buscar usuários do localStorage
      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      
      // Encontrar e atualizar o usuário
      const userIndex = allUsers.findIndex((u: User) => u.email === email);
      
      if (userIndex < 0) {
        toast.error('Usuário não encontrado.');
        return false;
      }
      
      // Atualizar a senha
      allUsers[userIndex].senha = newPassword;
      localStorage.setItem('allUsers', JSON.stringify(allUsers));
      
      // Remover o token usado
      delete resetTokens[email];
      localStorage.setItem('passwordResetTokens', JSON.stringify(resetTokens));
      
      toast.success('Senha redefinida com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      toast.error('Ocorreu um erro ao redefinir a senha.');
      return false;
    }
  };

  return {
    resetMasterPassword,
    requestPasswordReset,
    resetUserPassword
  };
};
