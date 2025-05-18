
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserData } from '@/types/user';

interface LogoUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: UserData;
  updateUserData: (updatedUser: UserData) => void;
}

const LogoUploadDialog = ({ open, onOpenChange, userData, updateUserData }: LogoUploadDialogProps) => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Create image preview
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
    
    // In a real application, the file would be sent to a server
    // In this example, we'll save the dataURL in localStorage
    localStorage.setItem('userLogoUrl', logoPreview);
    
    // Update local user
    const updatedUser = { ...userData, logoUrl: logoPreview };
    updateUserData(updatedUser);
    
    toast.success('Logotipo atualizado com sucesso!');
    handleCloseDialog();
  };
  
  const handleCloseDialog = () => {
    setLogoFile(null);
    setLogoPreview(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={handleCloseDialog}>
            Cancelar
          </Button>
          <Button onClick={handleSaveLogo} disabled={!logoFile}>
            Salvar Logotipo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoUploadDialog;
