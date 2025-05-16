
import React from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import DadosContratoForm from '@/components/calculadora/DadosContratoForm';
import AdicionaisForm from '@/components/calculadora/AdicionaisForm';
import ResultadosCalculos from '@/components/calculadora/ResultadosCalculos';
import useCalculadora from '@/hooks/useCalculadora';

const Calculadora = () => {
  const { 
    dadosContrato, 
    adicionais, 
    resultados, 
    handleDadosContratoChange, 
    handleAdicionaisChange, 
    calcularResultados 
  } = useCalculadora();

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-serif font-bold mb-6 text-juriscalc-navy">
          Calculadora de Verbas Trabalhistas
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna 1 - Formulário */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="contrato">
              <TabsList className="w-full">
                <TabsTrigger value="contrato" className="flex-1">Dados do Contrato</TabsTrigger>
                <TabsTrigger value="adicionais" className="flex-1">Adicionais e Multas</TabsTrigger>
              </TabsList>

              {/* Tab de Dados do Contrato */}
              <TabsContent value="contrato">
                <DadosContratoForm 
                  dadosContrato={dadosContrato}
                  onChange={handleDadosContratoChange}
                  onTipoRescisaoChange={(value) => {
                    if (value === 'sem_justa_causa' || value === 'pedido_demissao' || 
                        value === 'justa_causa' || value === 'rescisao_indireta') {
                      handleAdicionaisChange('tipoRescisao', value);
                    }
                  }}
                />
              </TabsContent>

              {/* Tab de Adicionais */}
              <TabsContent value="adicionais">
                <AdicionaisForm 
                  adicionais={adicionais}
                  onChange={handleAdicionaisChange}
                />
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <Button 
                onClick={calcularResultados}
                className="w-full bg-juriscalc-navy text-white hover:bg-opacity-90"
                size="lg"
              >
                Calcular Verbas
              </Button>
            </div>
          </div>
          
          {/* Coluna 2 - Resultados */}
          <div>
            <ResultadosCalculos resultados={resultados} adicionais={adicionais} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Calculadora;
