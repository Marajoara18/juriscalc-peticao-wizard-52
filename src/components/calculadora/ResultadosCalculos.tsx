import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatarMoeda } from '@/utils/formatters';
import { DadosContrato, Adicionais } from '@/types/calculadora';
import { cn } from '@/lib/utils';
import ExportResultsButton from './ExportResultsButton';
import { Mail, Share2 } from 'lucide-react';
import { toast } from "sonner";
import { shareViaWhatsApp, shareViaEmail, generateCalculationText } from '@/utils/exportUtils';
import ResultadosPrintable from './ResultadosPrintable';

interface ResultadosCalculosProps {
  resultados: any; 
  adicionais: Adicionais;
  dadosContrato: DadosContrato;
  onLoadCalculo?: (calculo: any) => void;
}

const ResultadosCalculos: React.FC<ResultadosCalculosProps> = ({ 
  resultados, 
  adicionais,
  dadosContrato,
  onLoadCalculo
}) => {
  // Apenas mostrar se houver resultados
  if (!resultados || (!resultados.verbasRescisorias && !resultados.adicionais)) {
    return null;
  }
  
  // Filtrar valores maiores que zero para não mostrar zeros
  const verbas = resultados.verbasRescisorias || {};
  const adicionaisResultado = resultados.adicionais || {};
  
  const verbasAMostrar = Object.entries(verbas).filter(([key, value]) => 
    typeof value === 'number' && value > 0 && key !== 'total' && key !== 'descontoAvisoPrevio'
  );
  
  const adicionaisAMostrar = Object.entries(adicionaisResultado).filter(([key, value]) => 
    typeof value === 'number' && value > 0 && key !== 'total' && key !== 'honorariosAdvocaticios'
  );
  
  // Calcular total dos adicionais (excluindo honorários advocatícios)
  const totalAdicionais = adicionaisAMostrar.reduce((acc, [_, value]) => acc + parseFloat(value as string), 0);
  
  // Verificar se há desconto de aviso prévio a mostrar
  const temDescontoAvisoPrevio = typeof verbas.descontoAvisoPrevio === 'number' && verbas.descontoAvisoPrevio > 0;
  
  // Calcular o subtotal (sem considerar honorários)
  const subTotal = verbas.total + totalAdicionais - (verbas.descontoAvisoPrevio || 0);
  
  // Total geral é o mesmo que subtotal agora que não mostramos honorários
  const totalGeral = subTotal;

  // Funções de compartilhamento
  const handleShareEmail = () => {
    const subject = encodeURIComponent("Cálculos Trabalhistas - IusCalc");
    const body = generateCalculationText(resultados);
    
    shareViaEmail(subject, body);
    toast.success("Preparando e-mail com os cálculos");
  };

  const handleShareWhatsApp = () => {
    const text = generateCalculationText(resultados);
    
    shareViaWhatsApp(text);
    toast.success("Compartilhando cálculos via WhatsApp");
  };

  return (
    <Card className="p-4 mt-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Resultados do Cálculo</h2>
      </div>
      
      {/* Verbas Rescisórias */}
      <Accordion type="single" collapsible className="mb-4" defaultValue="verbas">
        <AccordionItem value="verbas">
          <AccordionTrigger className="text-lg font-medium">
            Verbas Rescisórias
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {verbasAMostrar.map(([chave, valor]) => (
                <div key={chave} className="flex justify-between">
                  <span className="font-medium">
                    {chave === 'saldoSalario' && 'Saldo de Salário'}
                    {chave === 'avisoPrevia' && 'Aviso Prévio'}
                    {chave === 'decimoTerceiro' && '13º Salário Proporcional'}
                    {chave === 'ferias' && 'Férias Proporcionais'}
                    {chave === 'tercoConstitucional' && '1/3 Constitucional'}
                    {chave === 'fgts' && 'FGTS sobre verbas'}
                    {chave === 'multaFgts' && 'Multa FGTS (40%)'}
                  </span>
                  <span className="font-medium">{formatarMoeda(valor as number)}</span>
                </div>
              ))}
              
              {/* Mostrar desconto do aviso prévio se for aplicável */}
              {temDescontoAvisoPrevio && (
                <div className="flex justify-between text-red-600">
                  <span className="font-medium">Desconto Aviso Prévio não cumprido</span>
                  <span className="font-medium">- {formatarMoeda(verbas.descontoAvisoPrevio as number)}</span>
                </div>
              )}

              <div className="flex justify-between pt-2 border-t">
                <span className="font-bold">Total Verbas Rescisórias</span>
                <span className="font-bold">{formatarMoeda(verbas.total)}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {/* Adicionais - mostrar apenas se tiver algum */}
      {adicionaisAMostrar.length > 0 && (
        <Accordion type="single" collapsible className="mb-4" defaultValue="adicionais">
          <AccordionItem value="adicionais">
            <AccordionTrigger className="text-lg font-medium">
              Adicionais e Multas
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {adicionaisAMostrar.map(([chave, valor]) => (
                  <div key={chave} className="flex justify-between">
                    <span className="font-medium">
                      {chave === 'adicionalInsalubridade' && 'Adicional de Insalubridade'}
                      {chave === 'adicionalPericulosidade' && 'Adicional de Periculosidade'}
                      {chave === 'multa467' && 'Multa do Art. 467 CLT'}
                      {chave === 'multa477' && 'Multa do Art. 477 CLT'}
                      {chave === 'adicionalNoturno' && 'Adicional Noturno'}
                      {chave === 'horasExtras' && 'Horas Extras'}
                      {chave === 'feriasVencidas' && 'Férias Vencidas'}
                      {chave === 'indenizacaoDemissao' && 'Indenização por Demissão'}
                      {chave === 'valeTransporte' && 'Vale Transporte'}
                      {chave === 'valeAlimentacao' && 'Vale Alimentação'}
                      {chave === 'adicionalTransferencia' && 'Adicional de Transferência'}
                      {chave === 'descontosIndevidos' && 'Descontos Indevidos'}
                      {chave === 'diferencasSalariais' && 'Diferenças Salariais'}
                      {chave === 'customCalculo' && 'Cálculo Personalizado'}
                      {chave === 'seguroDesemprego' && 'Seguro Desemprego'}
                      {chave === 'salarioFamilia' && 'Salário Família'}
                    </span>
                    <span className="font-medium">{formatarMoeda(valor as number)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-bold">Total Adicionais</span>
                  <span className="font-bold">{formatarMoeda(totalAdicionais)}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
      
      {/* Mostrar subtotal */}
      <div className="flex justify-between mb-2">
        <span className="font-medium">
          Subtotal {temDescontoAvisoPrevio ? "(com desconto aviso prévio)" : ""} 
        </span>
        <span className="font-medium">{formatarMoeda(subTotal)}</span>
      </div>
      
      {/* Total Geral - com cores invertidas */}
      <div 
        className={cn(
          "flex justify-between p-3 rounded-md", 
          "bg-white text-juriscalc-navy border border-juriscalc-navy",
          "dark:bg-white dark:text-juriscalc-navy dark:border-juriscalc-navy"
        )}
      >
        <span className="font-bold text-lg">TOTAL GERAL</span>
        <span className="font-bold text-lg">
          {formatarMoeda(totalGeral)}
        </span>
      </div>
      
      {/* Botões de ação abaixo do Total Geral */}
      <div className="mt-4 flex flex-wrap gap-2 justify-end print:hidden">
        <Button 
          variant="outline"
          className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
          onClick={handleShareWhatsApp}
        >
          <Share2 className="h-4 w-4 mr-2" />
          WhatsApp
        </Button>
        
        <Button 
          variant="outline"
          className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
          onClick={handleShareEmail}
        >
          <Mail className="h-4 w-4 mr-2" />
          E-mail
        </Button>
        
        <ExportResultsButton resultados={resultados} />
      </div>
      
      {/* Componente para impressão em PDF - invisível na interface */}
      <ResultadosPrintable resultados={resultados} />
    </Card>
  );
};

export default ResultadosCalculos;
