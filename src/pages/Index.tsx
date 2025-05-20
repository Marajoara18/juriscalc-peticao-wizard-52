
import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, FileText, BookOpen, Check, Info, ArrowRight } from "lucide-react";
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import ManualRapido from '@/components/calculadora/ManualRapido';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  return (
    <Layout>
      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-juriscalc-navy to-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                Bem-vindo ao IusCalc Trabalhista
              </h1>
              <p className="text-lg mb-8 text-gray-200">
                Sua plataforma completa para automatizar cálculos trabalhistas e gerar petições com precisão e agilidade.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/calculadora">
                  <Button size="lg" className="bg-juriscalc-gold text-juriscalc-navy hover:bg-opacity-90">
                    <Calculator className="mr-2 h-5 w-5" />
                    Começar a Calcular
                  </Button>
                </Link>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white/10">
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
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-white/20">
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

      {/* How to Use Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center mb-12 text-juriscalc-navy">
            Como Utilizar o IusCalc
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-juriscalc-navy rounded-full flex items-center justify-center mr-3">
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
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-juriscalc-navy rounded-full flex items-center justify-center mr-3">
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
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-8 h-8 bg-juriscalc-navy rounded-full flex items-center justify-center mr-3">
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
                <Button className="bg-juriscalc-navy text-white">
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

      {/* Features Section */}
      <section className="py-16 bg-juriscalc-lightgray">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center mb-12 text-juriscalc-navy">
            Recursos Principais
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="juriscalc-card p-6">
              <div className="w-12 h-12 bg-juriscalc-navy rounded-full flex items-center justify-center mb-4">
                <Calculator size={24} className="text-juriscalc-gold" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3 text-juriscalc-navy">Calculadora Avançada</h3>
              <p className="text-juriscalc-darkgray">
                Calcule automaticamente verbas rescisórias, horas extras, adicionais de insalubridade, periculosidade e muito mais.
              </p>
            </div>
            
            <div className="juriscalc-card p-6">
              <div className="w-12 h-12 bg-juriscalc-navy rounded-full flex items-center justify-center mb-4">
                <FileText size={24} className="text-juriscalc-gold" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3 text-juriscalc-navy">Editor de Petições</h3>
              <p className="text-juriscalc-darkgray">
                Editor avançado com modelos personalizáveis e formatação jurídica automática para criar petições padronizadas.
              </p>
            </div>
            
            <div className="juriscalc-card p-6">
              <div className="w-12 h-12 bg-juriscalc-navy rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-juriscalc-gold">
                  <path d="M16 16V18a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1h3"></path>
                  <path d="M10 12a4 4 0 0 0 4 4h7a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-7a4 4 0 0 0-4 4Z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold mb-3 text-juriscalc-navy">Base de Conhecimento</h3>
              <p className="text-juriscalc-darkgray">
                Acesso a jurisprudências atualizadas, súmulas e OJs do TST para fundamentação precisa das petições.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold mb-6 text-juriscalc-navy">
            Pronto para Otimizar seu Trabalho?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-juriscalc-darkgray">
            Comece agora a usar o IusCalc Trabalhista e reduza em até 70% o tempo gasto na elaboração de petições iniciais trabalhistas.
          </p>
          <Link to="/calculadora">
            <Button size="lg" className="bg-juriscalc-navy text-white hover:bg-opacity-90">
              Começar Agora
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
