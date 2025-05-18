
import React from 'react';
import { User } from "lucide-react";

interface UserAvatarProps {
  logoUrl?: string;
  size?: 'small' | 'medium' | 'large';
}

const UserAvatar = ({ logoUrl, size = 'medium' }: UserAvatarProps) => {
  // Determine size class based on prop
  const sizeClass = {
    small: 'w-12 h-12',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
  }[size];
  
  const iconSize = {
    small: 24,
    medium: 40,
    large: 56,
  }[size];

  if (logoUrl) {
    return (
      <div className={`${sizeClass} rounded-full overflow-hidden border-2 border-juriscalc-navy`}>
        <img 
          src={logoUrl} 
          alt="Logo" 
          className="w-full h-full object-cover"
        />
      </div>
    );
  }
  
  return (
    <div className={`${sizeClass} rounded-full bg-juriscalc-lightgray flex items-center justify-center border-2 border-juriscalc-navy`}>
      <User size={iconSize} className="text-juriscalc-navy" />
    </div>
  );
};

export default UserAvatar;
