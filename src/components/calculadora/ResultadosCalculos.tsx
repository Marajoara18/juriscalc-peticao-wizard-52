
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { formatarMoeda } from '@/utils/formatters';
import { DadosContrato, Adicionais } from '@/types/calculadora';
import { cn } from '@/lib/utils';

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
    value > 0 && key !== 'total' && key !== 'descontoAvisoPrevio'
  );
  
  const adicionaisAMostrar = Object.entries(adicionaisResultado).filter(([key, value]) => 
    value > 0 && key !== 'total'
  );
  
  // Calcular total dos adicionais
  const totalAdicionais = adicionaisAMostrar.reduce((acc, [_, value]) => acc + parseFloat(value as string), 0);
  
  // Verificar se há desconto de aviso prévio a mostrar
  const temDescontoAvisoPrevio = verbas.descontoAvisoPrevio > 0;

  return (
    <Card className="p-4 mt-4">
      <h2 className="text-xl font-bold mb-2">Resultados do Cálculo</h2>
      
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
                    {chave === 'ferias' && 'Férias Proporcionais/Vencidas'}
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
      
      {/* Total Geral */}
      <div 
        className={cn(
          "flex justify-between p-3 rounded-md", 
          "bg-juriscalc-navy text-white",
          "dark:bg-juriscalc-navy dark:text-white"
        )}
      >
        <span className="font-bold text-lg">TOTAL GERAL</span>
        <span className="font-bold text-lg">
          {formatarMoeda(verbas.total + totalAdicionais - (verbas.descontoAvisoPrevio || 0))}
        </span>
      </div>
    </Card>
  );
};

export default ResultadosCalculos;
