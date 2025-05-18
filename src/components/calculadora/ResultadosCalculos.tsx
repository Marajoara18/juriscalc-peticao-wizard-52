import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FileText, Printer, Save } from 'lucide-react';
import { toast } from "sonner";
import { formatarMoeda } from '@/utils/formatters';
import { Resultados, Adicionais } from '@/types/calculadora';
import { CalculoSalvo } from '@/types/calculoSalvo';
import CalculosSalvos from './CalculosSalvos';
import SaveCalculoDialog from './dialogs/SaveCalculoDialog';

interface ResultadosCalculosProps {
  resultados: Resultados;
  adicionais: Adicionais;
  dadosContrato?: any; 
  onLoadCalculo?: (calculo: CalculoSalvo) => void;
}

const ResultadosCalculos: React.FC<ResultadosCalculosProps> = ({ 
  resultados, 
  adicionais,
  dadosContrato = {}, 
  onLoadCalculo
}) => {
  const navigate = useNavigate();
  const [showSalvos, setShowSalvos] = useState(false);
  const [expandedAccordions, setExpandedAccordions] = useState<string[]>([]);
  
  // Estado para o diálogo de salvar cálculo
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nomeCalculo, setNomeCalculo] = useState('');
  
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

  // Verificar se há valores calculados e expandir automaticamente os acordeões
  useEffect(() => {
    if (totalGeral > 0 && expandedAccordions.length === 0) {
      setExpandedAccordions(['verbas_rescisorias', 'adicionais', 'total_geral']);
    }
  }, [totalGeral, expandedAccordions]);
  
  // Função para controlar acordeões
  const handleAccordionChange = (value: string) => {
    setExpandedAccordions(prev => {
      if (prev.includes(value)) {
        return prev.filter(item => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

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
    const nomeEscritorio = localStorage.getItem('userName') || 'IusCalc';
    
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
              padding: 20px;
              background-color: #1e3a8a;
              color: white;
              font-size: 1.4em;
              font-weight: bold;
              text-align: center;
              border: 3px solid #000;
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
            .iuscalc-logo {
              display: flex;
              justify-content: center;
              align-items: center;
              margin-top: 10px;
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
            <div class="iuscalc-logo">
              <img src="/lovable-uploads/caf683c7-0cb3-4ef4-8e5f-5de22f996b8a.png" alt="Logo IusCalc" style="height: 20px; margin-right: 5px;" />
              <span style="font-weight: bold; color: #0f172a; font-family: serif;">IusCalc</span>
            </div>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Importante: adicionar um pequeno delay para garantir que o conteúdo seja carregado antes de imprimir
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
    const nomeEscritorio = localStorage.getItem('userName') || 'IusCalc';
    
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
    if (totalGeral === 0) {
      toast.error('Não há cálculos para salvar. Faça um cálculo primeiro.');
      return;
    }
    
    setNomeCalculo('');
    setDialogOpen(true);
  };
  
  const handleSalvar = () => {
    if (!nomeCalculo.trim()) {
      toast.error('Digite um nome para o cálculo');
      return;
    }

    const nomeEscritorio = localStorage.getItem('userName') || undefined;
    
    const novoCalculo: CalculoSalvo = {
      id: Date.now().toString(),
      nome: nomeCalculo,
      timestamp: new Date().toISOString(),
      verbasRescisorias: resultados.verbasRescisorias,
      adicionais: resultados.adicionais,
      totalGeral: totalGeral,
      userId: localStorage.getItem('userId') || undefined,
      nomeEscritorio,
      dadosContrato: {
        dataAdmissao: dadosContrato.dataAdmissao,
        dataDemissao: dadosContrato.dataDemissao,
        salarioBase: dadosContrato.salarioBase,
        tipoRescisao: dadosContrato.tipoRescisao,
        diasTrabalhados: dadosContrato.diasTrabalhados,
        mesesTrabalhados: dadosContrato.mesesTrabalhados,
      }
    };

    // Obter cálculos já salvos
    const calculosSalvosString = localStorage.getItem('calculosSalvos');
    let calculosSalvos: CalculoSalvo[] = [];
    
    if (calculosSalvosString) {
      try {
        calculosSalvos = JSON.parse(calculosSalvosString);
      } catch (error) {
        console.error('Erro ao carregar cálculos salvos:', error);
      }
    }
    
    // Adicionar novo cálculo no início do array
    const novosCalculos = [novoCalculo, ...calculosSalvos];
    
    // Salvar no localStorage
    localStorage.setItem('calculosSalvos', JSON.stringify(novosCalculos));
    
    setDialogOpen(false);
    toast.success('Cálculo salvo com sucesso!');
    
    // Mostrar a seção de cálculos salvos
    setShowSalvos(true);
  };
  
  const handleLoadCalculo = (calculo: CalculoSalvo) => {
    if (onLoadCalculo) {
      onLoadCalculo(calculo);
    }
  };

  // Verificar se há resultados para exibir
  const hasResults = totalGeral > 0;

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
            dadosContrato={dadosContrato}
            onLoadCalculo={handleLoadCalculo}
          />
        ) : hasResults ? (
          <>
            <Accordion 
              type="multiple" 
              className="w-full"
              value={expandedAccordions}
              onValueChange={(newValues) => setExpandedAccordions(newValues)}
            >
              <AccordionItem value="verbas_rescisorias">
                <AccordionTrigger className="font-serif font-semibold">
                  Verbas Rescisórias
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {resultados.verbasRescisorias.saldoSalario > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Saldo de Salário:</span>
                        <span className="font-medium">{formatarMoeda(resultados.verbasRescisorias.saldoSalario)}</span>
                      </div>
                    )}
                    {resultados.verbasRescisorias.avisoPrevia > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Aviso Prévio:</span>
                        <span className="font-medium">{formatarMoeda(resultados.verbasRescisorias.avisoPrevia)}</span>
                      </div>
                    )}
                    {resultados.verbasRescisorias.decimoTerceiro > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>13º Salário Proporcional:</span>
                        <span className="font-medium">{formatarMoeda(resultados.verbasRescisorias.decimoTerceiro)}</span>
                      </div>
                    )}
                    {resultados.verbasRescisorias.ferias > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Férias Proporcionais:</span>
                        <span className="font-medium">{formatarMoeda(resultados.verbasRescisorias.ferias)}</span>
                      </div>
                    )}
                    {resultados.verbasRescisorias.tercoConstitucional > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>1/3 Constitucional:</span>
                        <span className="font-medium">{formatarMoeda(resultados.verbasRescisorias.tercoConstitucional)}</span>
                      </div>
                    )}
                    {resultados.verbasRescisorias.fgts > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>FGTS sobre verbas:</span>
                        <span className="font-medium">{formatarMoeda(resultados.verbasRescisorias.fgts)}</span>
                      </div>
                    )}
                    {resultados.verbasRescisorias.multaFgts > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Multa FGTS (40%):</span>
                        <span className="font-medium">{formatarMoeda(resultados.verbasRescisorias.multaFgts)}</span>
                      </div>
                    )}
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
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <Button 
                      variant="outline" 
                      onClick={handleImprimirCalculos}
                    >
                      <Printer className="mr-2 h-4 w-4" />
                      Imprimir
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleSaveCalculo}
                      className="border-juriscalc-navy text-juriscalc-navy"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Cálculo
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
            
            {/* Diálogo para salvar cálculo */}
            <SaveCalculoDialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              nomeCalculo={nomeCalculo}
              setNomeCalculo={setNomeCalculo}
              isEditing={false}
              onSave={handleSalvar}
            />
          </>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p className="mb-2">Ainda não há cálculos para exibir.</p>
            <p className="text-sm">Preencha os dados do contrato e adicionais e clique em "Calcular Verbas".</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultadosCalculos;
