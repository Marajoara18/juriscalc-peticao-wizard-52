
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface AdicionaisItemProps {
  id: string;
  title: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children?: React.ReactNode;
}

const AdicionaisItem: React.FC<AdicionaisItemProps> = ({ 
  id, 
  title, 
  checked, 
  onChange, 
  children 
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="font-bold">
          {title}
        </Label>
        <Switch 
          id={id}
          checked={checked}
          onCheckedChange={onChange}
        />
      </div>
      
      {checked && children && (
        <div className="pl-4 border-l-2 border-gray-200 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
};

export default AdicionaisItem;
