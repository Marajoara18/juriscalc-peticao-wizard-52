
import React from 'react';
import { ArrowRight } from "lucide-react";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-juriscalc-navy to-blue-800 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-serif font-bold mb-6 text-white">
          Pronto para Otimizar seu Trabalho?
        </h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto text-white/90">
          Comece agora a usar o IusCalc Trabalhista e reduza em até 70% o tempo gasto na elaboração de petições iniciais trabalhistas.
        </p>
        <Link to="/calculadora">
          <Button size="lg" className="bg-juriscalc-gold text-juriscalc-navy hover:bg-opacity-90 shadow-lg transition-all duration-300">
            Começar Agora
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
