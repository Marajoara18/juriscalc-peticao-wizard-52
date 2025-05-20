
import React from 'react';
import { Info } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import ManualRapido from '@/components/calculadora/ManualRapido';

const HowToUseSection = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-serif font-bold text-center mb-12 text-juriscalc-navy">
          Como Utilizar o IusCalc
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-juriscalc-gold">
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-10 h-10 bg-juriscalc-navy rounded-full flex items-center justify-center mr-3">
                  <span className="text-juriscalc-gold font-bold">1</span>
                </div>
                Faça Login
              </CardTitle>
              <CardDescription>Acesse sua conta para começar</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-juriscalc-darkgray">
                Utilize seu e-mail e senha para acessar todas as funcionalidades do sistema. Se ainda não possui uma conta, cadastre-se gratuitamente.
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-juriscalc-gold">
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-10 h-10 bg-juriscalc-navy rounded-full flex items-center justify-center mr-3">
                  <span className="text-juriscalc-gold font-bold">2</span>
                </div>
                Realize Cálculos
              </CardTitle>
              <CardDescription>Calcule verbas trabalhistas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-juriscalc-darkgray">
                Informe os dados do contrato de trabalho e utilize nossa calculadora avançada para obter cálculos precisos de verbas rescisórias e adicionais.
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-juriscalc-gold">
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-10 h-10 bg-juriscalc-navy rounded-full flex items-center justify-center mr-3">
                  <span className="text-juriscalc-gold font-bold">3</span>
                </div>
                Gere Petições
              </CardTitle>
              <CardDescription>Crie documentos profissionais</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-juriscalc-darkgray">
                Utilize nossos modelos de petições para gerar documentos completos e profissionais, incorporando os cálculos realizados automaticamente.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-12 flex justify-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-juriscalc-navy text-white hover:bg-juriscalc-navy/90 shadow-md transition-all duration-300">
                <Info className="mr-2 h-4 w-4" />
                Saiba Mais sobre a Utilização
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <ManualRapido />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default HowToUseSection;
