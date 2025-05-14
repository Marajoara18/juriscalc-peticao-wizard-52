
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { formatarMoeda } from '@/utils/formatters';

type RescisionValues = {
  saldoSalario: number;
  avisoPrevia: number;
  decimoTerceiro: number;
  ferias: number;
  tercoConstitucional: number;
  fgts: number;
  multaFgts: number;
  total: number;
};

type AdditionalValues = {
  adicionalInsalubridade: number;
  adicionalPericulosidade: number;
  multa467: number;
  multa477: number;
  adicionalNoturno: number;
  horasExtras: number;
};

const Calculadora = () => {
  // Estado para os inputs
  const [dadosContrato, setDadosContrato] = useState({
    dataAdmissao: '',
    dataDemissao: '',
    salarioBase: '',
    tipoRescisao: 'sem_justa_causa',
    diasTrabalhados: '',
    mesesTrabalhados: '',
  });

  // Estado para calcular adicionais
  const [adicionais, setAdicionais] = useState({
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
  });

  // Estado para os resultados
  const [resultados, setResultados] = useState<{
    verbasRescisorias: RescisionValues, 
    adicionais: AdditionalValues
  }>({
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
    }
  });

  // Função para atualizar os dados do contrato
  const handleDadosContratoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDadosContrato(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função para atualizar os dados dos adicionais
  const handleAdicionaisChange = (name: string, value: string | boolean) => {
    setAdicionais(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função para calcular os resultados
  const calcularResultados = () => {
    const salarioBase = parseFloat(dadosContrato.salarioBase) || 0;
    const diasTrabalhados = parseInt(dadosContrato.diasTrabalhados) || 0;
    const mesesTrabalhados = parseInt(dadosContrato.mesesTrabalhados) || 0;
    const salarioMinimo = 1412; // Valor do salário mínimo 2024

    // Cálculo das verbas rescisórias
    const saldoSalario = (salarioBase / 30) * diasTrabalhados;
    const avisoPrevia = salarioBase;
    const decimoTerceiro = (salarioBase / 12) * mesesTrabalhados;
    const ferias = (salarioBase / 12) * mesesTrabalhados;
    const tercoConstitucional = ferias / 3;
    const fgts = (saldoSalario + avisoPrevia + decimoTerceiro) * 0.08;
    const multaFgts = fgts * 0.4;
    
    const totalVerbaRescisoria = saldoSalario + avisoPrevia + decimoTerceiro + ferias + tercoConstitucional + fgts + multaFgts;

    // Cálculo dos adicionais
    let adicionalInsalubridade = 0;
    if (adicionais.calcularInsalubridade) {
      const baseCalculo = adicionais.baseCalculoInsalubridade === 'salario_minimo' ? salarioMinimo : salarioBase;
      const percentualInsalubridade = adicionais.grauInsalubridade === 'minimo' ? 0.1 : adicionais.grauInsalubridade === 'medio' ? 0.2 : 0.4;
      adicionalInsalubridade = baseCalculo * percentualInsalubridade;
    }

    let adicionalPericulosidade = 0;
    if (adicionais.calcularPericulosidade) {
      const baseCalculo = adicionais.baseCalculoPericulosidade === 'salario_base' ? salarioBase : salarioMinimo;
      const percentual = parseInt(adicionais.percentualPericulosidade) / 100;
      adicionalPericulosidade = baseCalculo * percentual;
    }

    // Decisão entre insalubridade e periculosidade (não pode acumular)
    if (adicionais.calcularInsalubridade && adicionais.calcularPericulosidade) {
      if (adicionalPericulosidade > adicionalInsalubridade) {
        adicionalInsalubridade = 0;
      } else {
        adicionalPericulosidade = 0;
      }
    }

    // Cálculo da multa do Art. 467 da CLT
    let multa467 = 0;
    if (adicionais.calcularMulta467) {
      multa467 = (saldoSalario + avisoPrevia + decimoTerceiro + ferias + tercoConstitucional) * 0.5;
    }

    // Cálculo da multa do Art. 477 da CLT
    let multa477 = 0;
    if (adicionais.calcularMulta477) {
      multa477 = salarioBase;
    }

    // Cálculo do adicional noturno
    let adicionalNoturno = 0;
    if (adicionais.calcularAdicionalNoturno) {
      const valorHoraNormal = salarioBase / 220;
      const percentual = parseInt(adicionais.percentualAdicionalNoturno) / 100;
      const horasNoturnas = parseInt(adicionais.horasNoturnas) || 0;
      adicionalNoturno = valorHoraNormal * percentual * horasNoturnas;
    }

    // Cálculo de horas extras
    let horasExtras = 0;
    if (adicionais.calcularHorasExtras) {
      const valorHoraNormal = salarioBase / 220;
      const percentual = parseInt(adicionais.percentualHorasExtras) / 100;
      const quantidadeHorasExtras = parseInt(adicionais.quantidadeHorasExtras) || 0;
      horasExtras = valorHoraNormal * (1 + percentual) * quantidadeHorasExtras;
    }

    setResultados({
      verbasRescisorias: {
        saldoSalario,
        avisoPrevia,
        decimoTerceiro,
        ferias,
        tercoConstitucional,
        fgts,
        multaFgts,
        total: totalVerbaRescisoria,
      },
      adicionais: {
        adicionalInsalubridade,
        adicionalPericulosidade,
        multa467,
        multa477,
        adicionalNoturno,
        horasExtras,
      }
    });
  };

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
                <Card>
                  <CardHeader>
                    <CardTitle>Dados do Contrato</CardTitle>
                    <CardDescription>
                      Informe os dados básicos do contrato de trabalho
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="dataAdmissao" className="juriscalc-label">Data de Admissão</Label>
                        <Input 
                          id="dataAdmissao" 
                          name="dataAdmissao"
                          type="date" 
                          value={dadosContrato.dataAdmissao}
                          onChange={handleDadosContratoChange}
                          className="juriscalc-input" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="dataDemissao" className="juriscalc-label">Data de Demissão</Label>
                        <Input 
                          id="dataDemissao" 
                          name="dataDemissao"
                          type="date" 
                          value={dadosContrato.dataDemissao}
                          onChange={handleDadosContratoChange}
                          className="juriscalc-input" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="salarioBase" className="juriscalc-label">Salário Base (R$)</Label>
                        <Input 
                          id="salarioBase" 
                          name="salarioBase"
                          type="number" 
                          placeholder="0,00" 
                          value={dadosContrato.salarioBase}
                          onChange={handleDadosContratoChange}
                          className="juriscalc-input" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="tipoRescisao" className="juriscalc-label">Tipo de Rescisão</Label>
                        <Select 
                          value={dadosContrato.tipoRescisao} 
                          onValueChange={(value) => setDadosContrato({...dadosContrato, tipoRescisao: value})}
                        >
                          <SelectTrigger className="juriscalc-input">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sem_justa_causa">Sem Justa Causa (Empregador)</SelectItem>
                            <SelectItem value="pedido_demissao">Pedido de Demissão</SelectItem>
                            <SelectItem value="justa_causa">Justa Causa</SelectItem>
                            <SelectItem value="rescisao_indireta">Rescisão Indireta</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <Label htmlFor="diasTrabalhados" className="juriscalc-label">Dias Trabalhados no Mês da Rescisão</Label>
                        <Input 
                          id="diasTrabalhados" 
                          name="diasTrabalhados"
                          type="number" 
                          placeholder="0" 
                          value={dadosContrato.diasTrabalhados}
                          onChange={handleDadosContratoChange}
                          className="juriscalc-input" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="mesesTrabalhados" className="juriscalc-label">Meses Trabalhados no Ano</Label>
                        <Input 
                          id="mesesTrabalhados" 
                          name="mesesTrabalhados"
                          type="number" 
                          placeholder="0" 
                          value={dadosContrato.mesesTrabalhados}
                          onChange={handleDadosContratoChange}
                          className="juriscalc-input" 
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab de Adicionais */}
              <TabsContent value="adicionais">
                <Card>
                  <CardHeader>
                    <CardTitle>Adicionais e Multas</CardTitle>
                    <CardDescription>
                      Configure os adicionais e multas aplicáveis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Insalubridade */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="calcularInsalubridade" className="font-bold">
                          Adicional de Insalubridade
                        </Label>
                        <Switch 
                          id="calcularInsalubridade"
                          checked={adicionais.calcularInsalubridade}
                          onCheckedChange={(checked) => handleAdicionaisChange("calcularInsalubridade", checked)}
                        />
                      </div>
                      
                      {adicionais.calcularInsalubridade && (
                        <div className="pl-4 border-l-2 border-gray-200 space-y-3">
                          <div>
                            <Label htmlFor="grauInsalubridade" className="juriscalc-label">Grau de Insalubridade</Label>
                            <Select
                              value={adicionais.grauInsalubridade}
                              onValueChange={(value) => handleAdicionaisChange("grauInsalubridade", value)}
                            >
                              <SelectTrigger className="juriscalc-input">
                                <SelectValue placeholder="Selecione o grau" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="minimo">Mínimo (10%)</SelectItem>
                                <SelectItem value="medio">Médio (20%)</SelectItem>
                                <SelectItem value="maximo">Máximo (40%)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="baseCalculoInsalubridade" className="juriscalc-label">Base de Cálculo</Label>
                            <Select
                              value={adicionais.baseCalculoInsalubridade}
                              onValueChange={(value) => handleAdicionaisChange("baseCalculoInsalubridade", value)}
                            >
                              <SelectTrigger className="juriscalc-input">
                                <SelectValue placeholder="Selecione a base" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="salario_minimo">Salário Mínimo</SelectItem>
                                <SelectItem value="salario_base">Salário Base</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Periculosidade */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="calcularPericulosidade" className="font-bold">
                          Adicional de Periculosidade
                        </Label>
                        <Switch 
                          id="calcularPericulosidade"
                          checked={adicionais.calcularPericulosidade}
                          onCheckedChange={(checked) => handleAdicionaisChange("calcularPericulosidade", checked)}
                        />
                      </div>
                      
                      {adicionais.calcularPericulosidade && (
                        <div className="pl-4 border-l-2 border-gray-200 space-y-3">
                          <div>
                            <Label htmlFor="percentualPericulosidade" className="juriscalc-label">Percentual (%)</Label>
                            <Input 
                              id="percentualPericulosidade" 
                              value={adicionais.percentualPericulosidade}
                              onChange={(e) => handleAdicionaisChange("percentualPericulosidade", e.target.value)}
                              className="juriscalc-input" 
                              type="number"
                              min="0"
                              max="100"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="baseCalculoPericulosidade" className="juriscalc-label">Base de Cálculo</Label>
                            <Select
                              value={adicionais.baseCalculoPericulosidade}
                              onValueChange={(value) => handleAdicionaisChange("baseCalculoPericulosidade", value)}
                            >
                              <SelectTrigger className="juriscalc-input">
                                <SelectValue placeholder="Selecione a base" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="salario_base">Salário Base</SelectItem>
                                <SelectItem value="salario_minimo">Salário Mínimo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Multas */}
                    <div className="space-y-3">
                      <h3 className="font-serif font-semibold text-juriscalc-navy">Multas</h3>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="calcularMulta467" className="text-sm">
                          Multa do Art. 467 da CLT (50% sobre verbas incontroversas)
                        </Label>
                        <Switch 
                          id="calcularMulta467"
                          checked={adicionais.calcularMulta467}
                          onCheckedChange={(checked) => handleAdicionaisChange("calcularMulta467", checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="calcularMulta477" className="text-sm">
                          Multa do Art. 477 da CLT (atraso no pagamento)
                        </Label>
                        <Switch 
                          id="calcularMulta477"
                          checked={adicionais.calcularMulta477}
                          onCheckedChange={(checked) => handleAdicionaisChange("calcularMulta477", checked)}
                        />
                      </div>
                    </div>

                    {/* Adicional Noturno */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="calcularAdicionalNoturno" className="font-bold">
                          Adicional Noturno
                        </Label>
                        <Switch 
                          id="calcularAdicionalNoturno"
                          checked={adicionais.calcularAdicionalNoturno}
                          onCheckedChange={(checked) => handleAdicionaisChange("calcularAdicionalNoturno", checked)}
                        />
                      </div>
                      
                      {adicionais.calcularAdicionalNoturno && (
                        <div className="pl-4 border-l-2 border-gray-200 space-y-3">
                          <div>
                            <Label htmlFor="percentualAdicionalNoturno" className="juriscalc-label">Percentual (%)</Label>
                            <Input 
                              id="percentualAdicionalNoturno" 
                              value={adicionais.percentualAdicionalNoturno}
                              onChange={(e) => handleAdicionaisChange("percentualAdicionalNoturno", e.target.value)}
                              className="juriscalc-input" 
                              type="number"
                              min="0"
                              max="100"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="horasNoturnas" className="juriscalc-label">Quantidade de Horas Noturnas</Label>
                            <Input 
                              id="horasNoturnas" 
                              value={adicionais.horasNoturnas}
                              onChange={(e) => handleAdicionaisChange("horasNoturnas", e.target.value)}
                              className="juriscalc-input" 
                              type="number"
                              min="0"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Horas Extras */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="calcularHorasExtras" className="font-bold">
                          Horas Extras
                        </Label>
                        <Switch 
                          id="calcularHorasExtras"
                          checked={adicionais.calcularHorasExtras}
                          onCheckedChange={(checked) => handleAdicionaisChange("calcularHorasExtras", checked)}
                        />
                      </div>
                      
                      {adicionais.calcularHorasExtras && (
                        <div className="pl-4 border-l-2 border-gray-200 space-y-3">
                          <div>
                            <Label htmlFor="percentualHorasExtras" className="juriscalc-label">Adicional de Horas Extras (%)</Label>
                            <Select
                              value={adicionais.percentualHorasExtras}
                              onValueChange={(value) => handleAdicionaisChange("percentualHorasExtras", value)}
                            >
                              <SelectTrigger className="juriscalc-input">
                                <SelectValue placeholder="Selecione o percentual" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="50">50%</SelectItem>
                                <SelectItem value="60">60%</SelectItem>
                                <SelectItem value="100">100%</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="quantidadeHorasExtras" className="juriscalc-label">Quantidade de Horas Extras</Label>
                            <Input 
                              id="quantidadeHorasExtras" 
                              value={adicionais.quantidadeHorasExtras}
                              onChange={(e) => handleAdicionaisChange("quantidadeHorasExtras", e.target.value)}
                              className="juriscalc-input" 
                              type="number"
                              min="0"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
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
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Resultado dos Cálculos</CardTitle>
                <CardDescription>
                  Resumo dos valores calculados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="verbas_rescisorias">
                    <AccordionTrigger className="font-serif font-semibold">
                      Verbas Rescisórias
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Saldo de Salário:</span>
                          <span className="font-medium">{formatarMoeda(resultados.verbasRescisorias.saldoSalario)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Aviso Prévio:</span>
                          <span className="font-medium">{formatarMoeda(resultados.verbasRescisorias.avisoPrevia)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>13º Salário Proporcional:</span>
                          <span className="font-medium">{formatarMoeda(resultados.verbasRescisorias.decimoTerceiro)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Férias Proporcionais:</span>
                          <span className="font-medium">{formatarMoeda(resultados.verbasRescisorias.ferias)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>1/3 Constitucional:</span>
                          <span className="font-medium">{formatarMoeda(resultados.verbasRescisorias.tercoConstitucional)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>FGTS sobre verbas:</span>
                          <span className="font-medium">{formatarMoeda(resultados.verbasRescisorias.fgts)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Multa FGTS (40%):</span>
                          <span className="font-medium">{formatarMoeda(resultados.verbasRescisorias.multaFgts)}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-semibold">
                          <span>Total Rescisórias:</span>
                          <span className="text-juriscalc-navy">{formatarMoeda(resultados.verbasRescisorias.total)}</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="adicionais">
                    <AccordionTrigger className="font-serif font-semibold">
                      Adicionais e Multas
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {resultados.adicionais.adicionalInsalubridade > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>Adicional de Insalubridade:</span>
                            <span className="font-medium">{formatarMoeda(resultados.adicionais.adicionalInsalubridade)}</span>
                          </div>
                        )}
                        {resultados.adicionais.adicionalPericulosidade > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>Adicional de Periculosidade:</span>
                            <span className="font-medium">{formatarMoeda(resultados.adicionais.adicionalPericulosidade)}</span>
                          </div>
                        )}
                        {resultados.adicionais.multa467 > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>Multa Art. 467 da CLT:</span>
                            <span className="font-medium">{formatarMoeda(resultados.adicionais.multa467)}</span>
                          </div>
                        )}
                        {resultados.adicionais.multa477 > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>Multa Art. 477 da CLT:</span>
                            <span className="font-medium">{formatarMoeda(resultados.adicionais.multa477)}</span>
                          </div>
                        )}
                        {resultados.adicionais.adicionalNoturno > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>Adicional Noturno:</span>
                            <span className="font-medium">{formatarMoeda(resultados.adicionais.adicionalNoturno)}</span>
                          </div>
                        )}
                        {resultados.adicionais.horasExtras > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>Horas Extras:</span>
                            <span className="font-medium">{formatarMoeda(resultados.adicionais.horasExtras)}</span>
                          </div>
                        )}
                        
                        <Separator className="my-2" />
                        <div className="flex justify-between font-semibold">
                          <span>Total Adicionais:</span>
                          <span className="text-juriscalc-navy">
                            {formatarMoeda(
                              resultados.adicionais.adicionalInsalubridade +
                              resultados.adicionais.adicionalPericulosidade +
                              resultados.adicionais.multa467 +
                              resultados.adicionais.multa477 +
                              resultados.adicionais.adicionalNoturno +
                              resultados.adicionais.horasExtras
                            )}
                          </span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="total_geral">
                    <AccordionTrigger className="font-serif font-semibold">
                      Total Geral
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="bg-juriscalc-navy p-4 rounded-md text-white">
                        <div className="text-center">
                          <p className="text-sm font-medium mb-2">Valor Total da Reclamação</p>
                          <p className="text-2xl font-bold">
                            {formatarMoeda(
                              resultados.verbasRescisorias.total +
                              resultados.adicionais.adicionalInsalubridade +
                              resultados.adicionais.adicionalPericulosidade +
                              resultados.adicionais.multa467 +
                              resultados.adicionais.multa477 +
                              resultados.adicionais.adicionalNoturno +
                              resultados.adicionais.horasExtras
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-center">
                        <Button variant="outline" className="mr-2">
                          Imprimir Cálculos
                        </Button>
                        <Button className="bg-juriscalc-gold text-juriscalc-navy hover:bg-opacity-90">
                          Gerar Petição
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Calculadora;
