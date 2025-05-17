
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface HelpSectionProps {
  onSaveCalculos?: () => void;
  calculosDisponiveis?: boolean;
}

const HelpSection = ({ onSaveCalculos, calculosDisponiveis }: HelpSectionProps) => {
  const navigate = useNavigate();

  const handleSaveCalculos = () => {
    if (onSaveCalculos) {
      onSaveCalculos();
    } else {
      toast.info('Você precisa estar na calculadora para salvar cálculos');
      navigate('/calculadora');
    }
  };
  
  return (
    <div className="bg-juriscalc-lightgray rounded-lg p-6 mt-12">
      <div className="flex flex-col md:flex-row items-center justify-end">
        {calculosDisponiveis && (
          <Button 
            variant="outline" 
            className="border-juriscalc-navy text-juriscalc-navy"
            onClick={handleSaveCalculos}
          >
            <Save className="mr-2 h-4 w-4" />
            Salvar Cálculos
          </Button>
        )}
      </div>
    </div>
  );
};

export default HelpSection;
