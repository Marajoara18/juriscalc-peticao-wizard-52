
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { LayoutGrid, Smartphone, Save } from "lucide-react";

interface CalculadoraToolbarProps {
  showUserPanel: boolean;
  layoutMode: 'desktop' | 'mobile';
  toggleLayoutMode: () => void;
  handleComecaCalcular: () => void;
  setShowUserPanel: React.Dispatch<React.SetStateAction<boolean>>;
  showCalculosSalvos?: () => void;
}

const CalculadoraToolbar: React.FC<CalculadoraToolbarProps> = ({
  showUserPanel,
  layoutMode,
  toggleLayoutMode,
  handleComecaCalcular,
  setShowUserPanel,
  showCalculosSalvos
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-serif font-bold text-juriscalc-navy">
        Calculadora de Verbas Trabalhistas
      </h1>
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="border-juriscalc-navy text-juriscalc-navy"
          onClick={toggleLayoutMode}
          title={`Alternar para layout de ${layoutMode === 'desktop' ? 'Smartphone' : 'Computador'}`}
        >
          {layoutMode === 'desktop' ? (
            <Smartphone className="h-5 w-5 mr-2" />
          ) : (
            <LayoutGrid className="h-5 w-5 mr-2" />
          )}
          {layoutMode === 'desktop' ? 'Smartphone' : 'Computador'}
        </Button>
        <Button
          variant="outline"
          className="border-juriscalc-navy text-juriscalc-navy"
          onClick={handleComecaCalcular}
        >
          Começar Novo Cálculo
        </Button>
        <Button
          variant="outline"
          className="border-juriscalc-navy text-juriscalc-navy"
          onClick={showCalculosSalvos}
        >
          <Save className="h-5 w-5 mr-2" />
          Cálculos Salvos
        </Button>
        <Button
          variant={showUserPanel ? "default" : "outline"}
          className={showUserPanel 
            ? "bg-juriscalc-navy" 
            : "border-juriscalc-navy text-juriscalc-navy"}
          onClick={() => setShowUserPanel(!showUserPanel)}
        >
          {showUserPanel ? "Voltar à Calculadora" : "Minha Conta"}
        </Button>
      </div>
    </div>
  );
};

export default CalculadoraToolbar;
