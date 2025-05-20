
import React from 'react';
import { Calculator, FileText, Share2, MessageSquare, Mail, FileSpreadsheet } from "lucide-react";

const FeaturesSection = () => {
  return (
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
  );
};

export default FeaturesSection;
