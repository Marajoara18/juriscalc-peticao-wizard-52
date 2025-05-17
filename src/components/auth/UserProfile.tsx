
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LogOut, User, Upload } from "lucide-react";
import { toast } from "sonner";

interface UserProfileProps {
  userData: {
    id: string;
    nome: string;
    email: string;
    isAdmin: boolean;
    logoUrl?: string;
  };
  isMasterAdmin: boolean;
  onLogout: () => void;
  updateUserData: (updatedUser: any) => void;
}

const UserProfile = ({ userData, isMasterAdmin, onLogout, updateUserData }: UserProfileProps) => {
  const [logoDialogOpen, setLogoDialogOpen] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  const handleLogoUpload = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setLogoDialogOpen(true);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSaveLogo = () => {
    if (!logoFile || !logoPreview || !userData) return;
    
    // Em uma aplicação real, o arquivo seria enviado para um servidor
    // Neste exemplo, salvaremos o dataURL no localStorage
    localStorage.setItem('userLogoUrl', logoPreview);
    
    // Atualizar o usuário local
    const updatedUser = { ...userData, logoUrl: logoPreview };
    updateUserData(updatedUser);
    
    toast.success('Logotipo atualizado com sucesso!');
    setLogoDialogOpen(false);
  };

  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Perfil de Usuário</span>
            <Button 
              variant="outline" 
              onClick={onLogout}
              className="border-juriscalc-navy text-juriscalc-navy"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-shrink-0">
              {userData.logoUrl ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-juriscalc-navy">
                  <img 
                    src={userData.logoUrl} 
                    alt="Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-juriscalc-lightgray flex items-center justify-center border-2 border-juriscalc-navy">
                  <User size={40} className="text-juriscalc-navy" />
                </div>
              )}
            </div>
            
            <div className="flex-grow">
              <h3 className="text-xl font-bold mb-1">{userData.nome}</h3>
              <p className="text-gray-600 mb-3">{userData.email}</p>
              <p className="text-sm mb-4">
                {userData.isAdmin 
                  ? isMasterAdmin 
                    ? 'Administrador Mestre do Sistema' 
                    : 'Administrador do Sistema' 
                  : 'Usuário Padrão'}
              </p>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogoUpload}
              >
                <Upload className="h-4 w-4 mr-2" />
                {userData.logoUrl ? 'Atualizar Logotipo' : 'Adicionar Logotipo'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog para upload de logotipo */}
      <Dialog open={logoDialogOpen} onOpenChange={setLogoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload de Logotipo</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full"
              />
            </div>
            
            {logoPreview && (
              <div className="mt-4 flex justify-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-juriscalc-navy">
                  <img 
                    src={logoPreview} 
                    alt="Preview do logotipo" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogoDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveLogo} disabled={!logoFile}>
              Salvar Logotipo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserProfile;
