
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

const HelpSection = () => {
  const handleImprimir = () => {
    window.print();
  };
  
  return (
    <div className="bg-juriscalc-lightgray rounded-lg p-6 mt-12">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-serif font-bold mb-2 text-juriscalc-navy">Precisando de ajuda?</h3>
          <p className="text-juriscalc-darkgray mb-2">
            Em caso de dúvidas, entre em contato: <a href="mailto:johnnyrnsantos@gmail.com" className="text-juriscalc-navy underline">johnnyrnsantos@gmail.com</a>
          </p>
        </div>
        <Button 
          variant="outline" 
          className="border-juriscalc-navy text-juriscalc-navy"
          onClick={handleImprimir}
        >
          <Printer className="mr-2 h-4 w-4" />
          Imprimir Petição
        </Button>
      </div>
    </div>
  );
};

export default HelpSection;
