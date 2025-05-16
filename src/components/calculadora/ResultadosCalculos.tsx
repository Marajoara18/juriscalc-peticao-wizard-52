
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { formatarMoeda } from '@/utils/formatters';
import { Resultados } from '@/types/calculadora';
import { Adicionais } from '@/types/calculadora';

interface ResultadosCalculosProps {
  resultados: Resultados;
  adicionais: Adicionais;
}

const ResultadosCalculos: React.FC<ResultadosCalculosProps> = ({ resultados, adicionais }) => {
  // Calcular o total geral
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

  return (
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
                {resultados.adicionais.feriasVencidas > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Férias Vencidas (+ 1/3):</span>
                    <span className="font-medium">{formatarMoeda(resultados.adicionais.feriasVencidas)}</span>
                  </div>
                )}
                {resultados.adicionais.indenizacaoDemissao > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Indenização por Demissão Indevida:</span>
                    <span className="font-medium">{formatarMoeda(resultados.adicionais.indenizacaoDemissao)}</span>
                  </div>
                )}
                {resultados.adicionais.valeTransporte > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Vale Transporte Não Pago:</span>
                    <span className="font-medium">{formatarMoeda(resultados.adicionais.valeTransporte)}</span>
                  </div>
                )}
                {resultados.adicionais.valeAlimentacao > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Vale Alimentação Não Pago:</span>
                    <span className="font-medium">{formatarMoeda(resultados.adicionais.valeAlimentacao)}</span>
                  </div>
                )}
                {resultados.adicionais.adicionalTransferencia > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Adicional de Transferência:</span>
                    <span className="font-medium">{formatarMoeda(resultados.adicionais.adicionalTransferencia)}</span>
                  </div>
                )}
                {resultados.adicionais.descontosIndevidos > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Descontos Indevidos:</span>
                    <span className="font-medium">{formatarMoeda(resultados.adicionais.descontosIndevidos)}</span>
                  </div>
                )}
                {resultados.adicionais.diferencasSalariais > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Diferenças Salariais:</span>
                    <span className="font-medium">{formatarMoeda(resultados.adicionais.diferencasSalariais)}</span>
                  </div>
                )}
                {resultados.adicionais.customCalculo > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>{adicionais.descricaoCustom || "Cálculo Personalizado"}:</span>
                    <span className="font-medium">{formatarMoeda(resultados.adicionais.customCalculo)}</span>
                  </div>
                )}
                
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total Adicionais:</span>
                  <span className="text-juriscalc-navy">{formatarMoeda(totalAdicionais)}</span>
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
                    {formatarMoeda(totalGeral)}
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
  );
};

export default ResultadosCalculos;
