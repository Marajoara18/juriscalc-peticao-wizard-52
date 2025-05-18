
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import UserAvatar from './profile/UserAvatar';
import UserInfo from './profile/UserInfo';
import LogoUploadDialog from './profile/LogoUploadDialog';
import { UserData } from '@/types/user';

interface UserProfileProps {
  userData: UserData;
  isMasterAdmin: boolean;
  onLogout: () => void;
  updateUserData: (updatedUser: UserData) => void;
}

const UserProfile = ({ userData, isMasterAdmin, onLogout, updateUserData }: UserProfileProps) => {
  const [logoDialogOpen, setLogoDialogOpen] = useState(false);
  
  const handleLogoUpload = () => {
    setLogoDialogOpen(true);
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
            <UserAvatar logoUrl={userData.logoUrl} />
            <UserInfo 
              userData={userData}
              isMasterAdmin={isMasterAdmin}
              onLogoUpload={handleLogoUpload}
            />
          </div>
        </CardContent>
      </Card>

      <LogoUploadDialog
        open={logoDialogOpen}
        onOpenChange={setLogoDialogOpen}
        userData={userData}
        updateUserData={updateUserData}
      />
    </>
  );
};

export default UserProfile;
