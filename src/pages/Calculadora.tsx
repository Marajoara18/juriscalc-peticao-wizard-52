import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import DadosContratoForm from '@/components/calculadora/DadosContratoForm';
import AdicionaisForm from '@/components/calculadora/AdicionaisForm';
import ResultadosCalculos from '@/components/calculadora/ResultadosCalculos';
import UserManagement from '@/components/auth/UserManagement';
import HelpSection from '@/components/peticoes/HelpSection';
import useCalculadora from '@/hooks/useCalculadora';
import { toast } from 'sonner';

const Calculadora = () => {
  const navigate = useNavigate();
  const { 
    dadosContrato, 
    adicionais, 
    resultados,
    setDadosContrato,
    setAdicionais,
    setResultados,
    handleDadosContratoChange, 
    handleAdicionaisChange, 
    calcularResultados 
  } = useCalculadora();
  
  const [showUserPanel, setShowUserPanel] = useState(false);
  
  // Verificar se o usuário está logado
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/');
    }
  }, [navigate]);
  
  const handleComecaCalcular = () => {
    // Reiniciar dados do formulário
    setDadosContrato({
      dataAdmissao: '',
      dataDemissao: '',
      salarioBase: '',
      tipoRescisao: 'sem_justa_causa',
      diasTrabalhados: '',
      mesesTrabalhados: '',
    });
    
    // Reiniciar campos de adicionais
    setAdicionais({
      calcularInsalubridade: false,
      grauInsalubridade: 'minimo',
      baseCalculoInsalubridade: 'salario_minimo',
      calcularPericulosidade: false,
      percentualPericulosidade: '30',
      baseCalculoPericulosidade: 'salario_base',
      calcularMulta467: false,
      calcularMulta477: false,
      calcularAdicionalNoturno: false,
      percentualAdicionalNoturno: '20',
      horasNoturnas: '',
      calcularHorasExtras: false,
      quantidadeHorasExtras: '',
      percentualHorasExtras: '50',
      calcularFeriasVencidas: false,
      periodosFeriasVencidas: '1',
      calcularIndenizacaoDemissao: false,
      valorIndenizacaoDemissao: '',
      calcularValeTransporte: false,
      valorDiarioVT: '',
      diasValeTransporte: '',
      calcularValeAlimentacao: false,
      valorDiarioVA: '',
      diasValeAlimentacao: '',
      calcularAdicionalTransferencia: false,
      percentualAdicionalTransferencia: '25',
      calcularDescontosIndevidos: false,
      valorDescontosIndevidos: '',
      calcularDiferencasSalariais: false,
      valorDiferencasSalariais: '',
      calcularCustom: false,
      descricaoCustom: '',
      valorCustom: '',
      calcularSeguroDesemprego: false,
      ultimoSalario: '',
      mesesTrabalhadosUltimoEmprego: '',
      tempoContribuicaoINSS: '',
    });
    
    // Reiniciar resultados
    setResultados({
      verbasRescisorias: {
        saldoSalario: 0,
        avisoPrevia: 0,
        decimoTerceiro: 0,
        ferias: 0,
        tercoConstitucional: 0,
        fgts: 0,
        multaFgts: 0,
        total: 0,
      },
      adicionais: {
        adicionalInsalubridade: 0,
        adicionalPericulosidade: 0,
        multa467: 0,
        multa477: 0,
        adicionalNoturno: 0,
        horasExtras: 0,
        feriasVencidas: 0,
        indenizacaoDemissao: 0,
        valeTransporte: 0,
        valeAlimentacao: 0,
        adicionalTransferencia: 0,
        descontosIndevidos: 0,
        diferencasSalariais: 0,
        customCalculo: 0,
      }
    });
    
    toast.info('Formulário reiniciado. Você pode iniciar um novo cálculo.');
  };
  
  const handleLoadCalculo = (calculo: any) => {
    if (!calculo) return;
    
    // Carregar adicionais do cálculo
    if (calculo.adicionais) {
      // Mapear adicionais para o formato esperado pelo hook
      // Este é um exemplo simples, você pode precisar mapear mais campos
      setAdicionais({
        ...adicionais,
        calcularInsalubridade: calculo.adicionais.adicionalInsalubridade > 0,
        calcularPericulosidade: calculo.adicionais.adicionalPericulosidade > 0,
        calcularMulta467: calculo.adicionais.multa467 > 0,
        calcularMulta477: calculo.adicionais.multa477 > 0,
        calcularAdicionalNoturno: calculo.adicionais.adicionalNoturno > 0,
        calcularHorasExtras: calculo.adicionais.horasExtras > 0,
        calcularFeriasVencidas: calculo.adicionais.feriasVencidas > 0,
        calcularIndenizacaoDemissao: calculo.adicionais.indenizacaoDemissao > 0,
        calcularValeTransporte: calculo.adicionais.valeTransporte > 0,
        calcularValeAlimentacao: calculo.adicionais.valeAlimentacao > 0,
        calcularAdicionalTransferencia: calculo.adicionais.adicionalTransferencia > 0,
        calcularDescontosIndevidos: calculo.adicionais.descontosIndevidos > 0,
        calcularDiferencasSalariais: calculo.adicionais.diferencasSalariais > 0,
        calcularCustom: calculo.adicionais.customCalculo > 0,
      });
    }
    
    // Carregar resultados
    setResultados({
      verbasRescisorias: calculo.verbasRescisorias,
      adicionais: calculo.adicionais
    });
    
    toast.success('Cálculo carregado com sucesso!');
  };
  
  // Calcular o total geral para o botão de salvar cálculos
  const totalAdicionais = 
    resultados.adicionais.adicionalInsalubridade +
    resultados.adicionais.adicionalPericulosidade +
    resultados.adicionais.multa467 +
    resultados.adicionais.multa477 +
    resultados.adicionais.adicionalNoturno +
    resultados.adicionais.horasExtras +
    resultados.adicionais.feriasVencidas +
    resultados.adicionais.indenizacaoDemissao +
    resultados.adicionais.valeTransporte +
    resultados.adicionais.valeAlimentacao +
    resultados.adicionais.adicionalTransferencia +
    resultados.adicionais.descontosIndevidos +
    resultados.adicionais.diferencasSalariais +
    resultados.adicionais.customCalculo;

  const totalGeral = resultados.verbasRescisorias.total + totalAdicionais;
  
  // Verificar se há cálculos para mostrar opção de salvar
  const hasCalculos = totalGeral > 0;

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-serif font-bold text-juriscalc-navy">
            Calculadora de Verbas Trabalhistas
          </h1>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-juriscalc-navy text-juriscalc-navy"
              onClick={handleComecaCalcular}
            >
              Começar Novo Cálculo
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

        {showUserPanel ? (
          <UserManagement />
        ) : (
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
              <ResultadosCalculos 
                resultados={resultados} 
                adicionais={adicionais} 
                onLoadCalculo={handleLoadCalculo}
              />
            </div>
          </div>
        )}
        
        <HelpSection 
          calculosDisponiveis={hasCalculos}
        />
      </div>
    </Layout>
  );
};

export default Calculadora;
