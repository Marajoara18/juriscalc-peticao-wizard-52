
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { LogIn, UserPlus } from 'lucide-react';

interface User {
  id: string;
  nome: string;
  email: string;
  senha: string;
  isAdmin: boolean;
  logoUrl?: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  
  // Estados de login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginSenha, setLoginSenha] = useState('');
  
  // Estados de cadastro
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  
  // Verificar se já está logado
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      navigate('/calculadora');
    }
    
    // Inicializar usuário admin se não existir
    initializeAdminUser();
  }, [navigate]);
  
  const initializeAdminUser = () => {
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    
    // Se não houver usuários, criar um admin
    if (allUsers.length === 0) {
      const adminUser: User = {
        id: 'admin-1',
        nome: 'Administrador',
        email: 'admin@iuscalc.com',
        senha: 'admin123',
        isAdmin: true
      };
      
      allUsers.push(adminUser);
      localStorage.setItem('allUsers', JSON.stringify(allUsers));
      console.log('Usuário admin criado com sucesso!');
    }
  };
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginSenha) {
      toast.error('Preencha todos os campos');
      return;
    }
    
    // Buscar usuários do localStorage
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    
    // Encontrar usuário com o email informado
    const user = allUsers.find((u: User) => u.email === loginEmail);
    
    if (!user) {
      toast.error('Usuário não encontrado');
      return;
    }
    
    if (user.senha !== loginSenha) {
      toast.error('Senha incorreta');
      return;
    }
    
    // Login bem-sucedido
    localStorage.setItem('userId', user.id);
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('userName', user.nome);
    localStorage.setItem('userIsAdmin', String(user.isAdmin));
    if (user.logoUrl) {
      localStorage.setItem('userLogoUrl', user.logoUrl);
    }
    
    toast.success('Login realizado com sucesso!');
    navigate('/calculadora');
  };
  
  const handleCadastro = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome || !email || !senha || !confirmSenha) {
      toast.error('Preencha todos os campos');
      return;
    }
    
    if (senha !== confirmSenha) {
      toast.error('As senhas não conferem');
      return;
    }
    
    // Buscar usuários do localStorage
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    
    // Verificar se já existe usuário com o mesmo email
    const userExists = allUsers.some((u: User) => u.email === email);
    
    if (userExists) {
      toast.error('Este e-mail já está cadastrado');
      return;
    }
    
    // Criar novo usuário
    const newUser: User = {
      id: `user-${Date.now()}`,
      nome,
      email,
      senha,
      isAdmin: false
    };
    
    allUsers.push(newUser);
    localStorage.setItem('allUsers', JSON.stringify(allUsers));
    
    // Fazer login automático
    localStorage.setItem('userId', newUser.id);
    localStorage.setItem('userEmail', newUser.email);
    localStorage.setItem('userName', newUser.nome);
    localStorage.setItem('userIsAdmin', 'false');
    
    toast.success('Cadastro realizado com sucesso!');
    navigate('/calculadora');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-juriscalc-navy">IusCalc</h1>
          <p className="mt-2 text-gray-600">Sua plataforma de cálculos trabalhistas</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="cadastro">Cadastro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Acesse sua conta</CardTitle>
                <CardDescription className="text-center">
                  Entre com seus dados para acessar o sistema
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium">
                      E-mail
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
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
                      value={loginSenha}
                      onChange={(e) => setLoginSenha(e.target.value)}
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
          </TabsContent>
          
          <TabsContent value="cadastro">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Crie sua conta</CardTitle>
                <CardDescription className="text-center">
                  Preencha os dados abaixo para se cadastrar
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleCadastro}>
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
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email-cadastro" className="block text-sm font-medium">
                      E-mail
                    </label>
                    <Input
                      id="email-cadastro"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="senha-cadastro" className="block text-sm font-medium">
                      Senha
                    </label>
                    <Input
                      id="senha-cadastro"
                      type="password"
                      placeholder="Crie uma senha"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="confirm-senha" className="block text-sm font-medium">
                      Confirmar Senha
                    </label>
                    <Input
                      id="confirm-senha"
                      type="password"
                      placeholder="Confirme sua senha"
                      value={confirmSenha}
                      onChange={(e) => setConfirmSenha(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-juriscalc-gold text-juriscalc-navy hover:bg-opacity-90">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Cadastrar
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
