
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FileText, Printer } from 'lucide-react';
import { toast } from "sonner";
import { formatarMoeda } from '@/utils/formatters';
import { Resultados, Adicionais } from '@/types/calculadora';
import CalculosSalvos from './CalculosSalvos';

interface ResultadosCalculosProps {
  resultados: Resultados;
  adicionais: Adicionais;
  onLoadCalculo?: (calculo: any) => void;
}

const ResultadosCalculos: React.FC<ResultadosCalculosProps> = ({ 
  resultados, 
  adicionais,
  onLoadCalculo
}) => {
  const navigate = useNavigate();
  const [showSalvos, setShowSalvos] = useState(false);
  
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
    resultados.adicionais.customCalculo +
    resultados.adicionais.seguroDesemprego;

  const totalGeral = resultados.verbasRescisorias.total + totalAdicionais;

  // Função para imprimir cálculos
  const handleImprimirCalculos = () => {
    // Preparando a página de impressão
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está desativado.');
      return;
    }
    
    // Obter o logo e o nome do escritório
    const logoUrl = localStorage.getItem('userLogoUrl');
    const nomeEscritorio = localStorage.getItem('userName') || 'JurisCalc Trabalhista';
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cálculos Trabalhistas</title>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #1e3a8a;
              margin-bottom: 5px;
            }
            .section {
              margin-bottom: 30px;
            }
            .section h2 {
              color: #1e3a8a;
              border-bottom: 1px solid #ddd;
              padding-bottom: 10px;
              margin-bottom: 15px;
            }
            .item {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              border-bottom: 1px dotted #ddd;
              padding-bottom: 8px;
            }
            .total {
              font-weight: bold;
              margin-top: 15px;
              font-size: 1.1em;
            }
            .grand-total {
              margin-top: 30px;
              padding: 15px;
              background-color: #1e3a8a;
              color: white;
              font-size: 1.2em;
              font-weight: bold;
              text-align: center;
            }
            .logo {
              max-width: 200px;
              max-height: 100px;
              margin-bottom: 15px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 14px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            ${logoUrl ? `<img src="${logoUrl}" alt="Logo do Escritório" class="logo" />` : ''}
            <h1>Cálculos Trabalhistas</h1>
            <p>Data: ${new Date().toLocaleDateString('pt-BR')}</p>
          </div>
          
          <div class="section">
            <h2>Verbas Rescisórias</h2>
            ${renderVerbaItem('Saldo de Salário', resultados.verbasRescisorias.saldoSalario)}
            ${renderVerbaItem('Aviso Prévio', resultados.verbasRescisorias.avisoPrevia)}
            ${renderVerbaItem('13º Salário Proporcional', resultados.verbasRescisorias.decimoTerceiro)}
            ${renderVerbaItem('Férias Proporcionais', resultados.verbasRescisorias.ferias)}
            ${renderVerbaItem('1/3 Constitucional', resultados.verbasRescisorias.tercoConstitucional)}
            ${renderVerbaItem('FGTS sobre verbas', resultados.verbasRescisorias.fgts)}
            ${renderVerbaItem('Multa FGTS (40%)', resultados.verbasRescisorias.multaFgts)}
            <div class="item total">
              <span>Total Verbas Rescisórias:</span>
              <span>${formatarMoeda(resultados.verbasRescisorias.total)}</span>
            </div>
          </div>
          
          <div class="section">
            <h2>Adicionais e Multas</h2>
            ${resultados.adicionais.adicionalInsalubridade > 0 ? renderVerbaItem('Adicional de Insalubridade', resultados.adicionais.adicionalInsalubridade) : ''}
            ${resultados.adicionais.adicionalPericulosidade > 0 ? renderVerbaItem('Adicional de Periculosidade', resultados.adicionais.adicionalPericulosidade) : ''}
            ${resultados.adicionais.multa467 > 0 ? renderVerbaItem('Multa Art. 467 da CLT', resultados.adicionais.multa467) : ''}
            ${resultados.adicionais.multa477 > 0 ? renderVerbaItem('Multa Art. 477 da CLT', resultados.adicionais.multa477) : ''}
            ${resultados.adicionais.adicionalNoturno > 0 ? renderVerbaItem('Adicional Noturno', resultados.adicionais.adicionalNoturno) : ''}
            ${resultados.adicionais.horasExtras > 0 ? renderVerbaItem('Horas Extras', resultados.adicionais.horasExtras) : ''}
            ${resultados.adicionais.feriasVencidas > 0 ? renderVerbaItem('Férias Vencidas (+ 1/3)', resultados.adicionais.feriasVencidas) : ''}
            ${resultados.adicionais.indenizacaoDemissao > 0 ? renderVerbaItem('Indenização por Demissão Indevida', resultados.adicionais.indenizacaoDemissao) : ''}
            ${resultados.adicionais.valeTransporte > 0 ? renderVerbaItem('Vale Transporte Não Pago', resultados.adicionais.valeTransporte) : ''}
            ${resultados.adicionais.valeAlimentacao > 0 ? renderVerbaItem('Vale Alimentação Não Pago', resultados.adicionais.valeAlimentacao) : ''}
            ${resultados.adicionais.adicionalTransferencia > 0 ? renderVerbaItem('Adicional de Transferência', resultados.adicionais.adicionalTransferencia) : ''}
            ${resultados.adicionais.descontosIndevidos > 0 ? renderVerbaItem('Descontos Indevidos', resultados.adicionais.descontosIndevidos) : ''}
            ${resultados.adicionais.diferencasSalariais > 0 ? renderVerbaItem('Diferenças Salariais', resultados.adicionais.diferencasSalariais) : ''}
            ${resultados.adicionais.customCalculo > 0 ? renderVerbaItem(adicionais.descricaoCustom || 'Cálculo Personalizado', resultados.adicionais.customCalculo) : ''}
            ${resultados.adicionais.seguroDesemprego > 0 ? renderVerbaItem('Seguro-Desemprego', resultados.adicionais.seguroDesemprego) : ''}
            <div class="item total">
              <span>Total Adicionais:</span>
              <span>${formatarMoeda(totalAdicionais)}</span>
            </div>
          </div>
          
          <div class="grand-total">
            <div>Valor Total da Reclamação: ${formatarMoeda(totalGeral)}</div>
          </div>
          
          <div class="footer">
            <p>Cálculos realizados por: <strong>${nomeEscritorio}</strong></p>
            <p>JurisCalc Trabalhista &copy; ${new Date().getFullYear()}</p>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
    }, 500);
    
    toast.success('Preparando impressão dos cálculos...');
  };

  function renderVerbaItem(label: string, value: number) {
    if (value <= 0) return '';
    return `
      <div class="item">
        <span>${label}:</span>
        <span>${formatarMoeda(value)}</span>
      </div>
    `;
  }
  
  // Função para gerar petição
  const handleGerarPeticao = () => {
    // Verificar se existe usuário logado
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('Você precisa estar logado para gerar uma petição');
      navigate('/');
      return;
    }
    
    // Obter o nome do escritório
    const nomeEscritorio = localStorage.getItem('userName') || 'JurisCalc Trabalhista';
    
    // Salvando os cálculos no localStorage para usar na página de petições
    const calculosParaPeticao = {
      verbasRescisorias: resultados.verbasRescisorias,
      adicionais: resultados.adicionais,
      totalGeral: totalGeral,
      timestamp: new Date().toISOString(),
      nomeEscritorio: nomeEscritorio
    };
    
    localStorage.setItem('calculosParaPeticao', JSON.stringify(calculosParaPeticao));
    
    toast.success('Cálculos prontos para serem inseridos na petição!');
    navigate('/peticoes');
  };
  
  const handleSaveCalculo = () => {
    setShowSalvos(true);
  };
  
  const handleLoadCalculo = (calculo: any) => {
    if (onLoadCalculo) {
      onLoadCalculo(calculo);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Resultado dos Cálculos</CardTitle>
            <CardDescription>
              Resumo dos valores calculados
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowSalvos(!showSalvos)}
            className="text-juriscalc-navy border-juriscalc-navy"
          >
            {showSalvos ? 'Ocultar Salvos' : 'Ver Salvos'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showSalvos ? (
          <CalculosSalvos 
            resultados={resultados} 
            totalGeral={totalGeral} 
            onLoadCalculo={handleLoadCalculo}
          />
        ) : (
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
                  
                  {resultados.adicionais.seguroDesemprego > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Seguro-Desemprego:</span>
                      <span className="font-medium">{formatarMoeda(resultados.adicionais.seguroDesemprego)}</span>
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
                  <Button 
                    variant="outline" 
                    className="mr-2"
                    onClick={handleImprimirCalculos}
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir Cálculos
                  </Button>
                  <Button 
                    className="bg-juriscalc-gold text-juriscalc-navy hover:bg-opacity-90"
                    onClick={handleGerarPeticao}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Gerar Petição
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultadosCalculos;
