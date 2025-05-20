
import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, FileText, BookOpen, Check, Info, ArrowRight, FileSpreadsheet, Mail, Share2, MessageSquare } from "lucide-react";
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import ManualRapido from '@/components/calculadora/ManualRapido';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  return (
    <Layout>
      {/* Welcome Section with more elegant styling */}
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

      {/* How to Use Section with improved styling */}
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

      {/* Features Section with updated sharing icons order */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center mb-12 text-juriscalc-navy">
            Recursos Principais
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="juriscalc-card p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-14 h-14 bg-juriscalc-navy rounded-full flex items-center justify-center mb-4">
                <Calculator size={28} className="text-juriscalc-gold" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3 text-juriscalc-navy">Calculadora Avançada</h3>
              <p className="text-juriscalc-darkgray">
                Calcule automaticamente verbas rescisórias, horas extras, adicionais de insalubridade, periculosidade e muito mais.
              </p>
            </div>
            
            <div className="juriscalc-card p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-14 h-14 bg-juriscalc-navy rounded-full flex items-center justify-center mb-4">
                <FileText size={28} className="text-juriscalc-gold" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3 text-juriscalc-navy">Editor de Petições</h3>
              <p className="text-juriscalc-darkgray">
                Editor avançado com modelos personalizáveis e formatação jurídica automática para criar petições padronizadas.
              </p>
            </div>
            
            <div className="juriscalc-card p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-14 h-14 bg-juriscalc-navy rounded-full flex items-center justify-center mb-4">
                <Share2 size={28} className="text-juriscalc-gold" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3 text-juriscalc-navy">Compartilhamento Fácil</h3>
              <p className="text-juriscalc-darkgray">
                Compartilhe seus cálculos via WhatsApp, e-mail e exporte em formatos PDF e Excel para facilitar a comunicação com clientes e colegas.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="inline-flex items-center text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
                  <MessageSquare className="mr-1 h-3 w-3" />
                  WhatsApp
                </span>
                <span className="inline-flex items-center text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                  <Mail className="mr-1 h-3 w-3" />
                  E-mail
                </span>
                <span className="inline-flex items-center text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-700">
                  <FileText className="mr-1 h-3 w-3" />
                  PDF
                </span>
                <span className="inline-flex items-center text-xs font-medium px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                  <FileSpreadsheet className="mr-1 h-3 w-3" />
                  Excel
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with improved styling */}
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
    </Layout>
  );
};

export default Index;
