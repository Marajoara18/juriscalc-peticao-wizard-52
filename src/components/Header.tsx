
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calculator, FileText } from "lucide-react";
import { Button } from '@/components/ui/button';

const Header = () => {
  const navigate = useNavigate();
  
  const handleNewPeticao = () => {
    navigate('/peticoes');
  };
  
  return (
    <header className="bg-juriscalc-navy text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-juriscalc-gold p-1 rounded">
            <Calculator size={24} className="text-juriscalc-navy" />
          </div>
          <span className="font-serif text-xl font-bold">IusCalc Trabalhista</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-juriscalc-gold transition-colors">Home</Link>
          <Link to="/calculadora" className="hover:text-juriscalc-gold transition-colors">Calculadora</Link>
          <Link to="/peticoes" className="hover:text-juriscalc-gold transition-colors">Petições</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button 
            className="bg-juriscalc-gold text-juriscalc-navy hover:bg-opacity-90"
            onClick={handleNewPeticao}
          >
            <FileText className="mr-2 h-4 w-4" />
            Nova Petição
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
