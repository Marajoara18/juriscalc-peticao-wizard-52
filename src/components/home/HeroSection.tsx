
import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, BookOpen } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import ManualRapido from '@/components/calculadora/ManualRapido';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-juriscalc-navy to-blue-800 text-white py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
              Bem-vindo ao IusCalc Trabalhista
            </h1>
            <p className="text-lg mb-8 text-gray-200 leading-relaxed">
              Sua plataforma completa para automatizar cálculos trabalhistas e gerar petições com precisão e agilidade.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/calculadora">
                <Button size="lg" className="bg-juriscalc-gold text-juriscalc-navy hover:bg-opacity-90 shadow-lg transition-all duration-300">
                  <Calculator className="mr-2 h-5 w-5" />
                  Começar a Calcular
                </Button>
              </Link>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white/10 shadow-lg transition-all duration-300">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Manual Rápido
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <ManualRapido />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-2xl border border-white/20 transform hover:scale-[1.01] transition-transform duration-300">
              <img 
                src="/lovable-uploads/520e0a12-c37a-4e2d-8eb3-0abe543bc359.png" 
                alt="IusCalc App Interface" 
                className="rounded-md w-full shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
