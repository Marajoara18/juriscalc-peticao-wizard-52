
import React from 'react';
import { formatarMoeda } from '@/utils/formatters';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";

interface TabelaCalculosProps {
  calculos: any;
  onInserirNoPeticao: () => void;
  embutido?: boolean; // Prop para indicar se está embutido na petição
}

const TabelaCalculos: React.FC<TabelaCalculosProps> = ({ calculos, onInserirNoPeticao, embutido = false }) => {
  if (!calculos || (!calculos.verbasRescisorias && !calculos.adicionais)) {
    return (
      <Card className="mb-6 border-dashed border-2 border-gray-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Cálculos Trabalhistas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-gray-500 mb-4">Não há cálculos disponíveis para exibir.</p>
            <p className="text-sm text-gray-400">
              Utilize a calculadora trabalhista para gerar valores e incluir na petição.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Garantir que os objetos existam para evitar erros
  const verbasRescisorias = calculos.verbasRescisorias || {
    saldoSalario: 0,
    avisoPrevia: 0,
    decimoTerceiro: 0,
    ferias: 0,
    tercoConstitucional: 0,
    fgts: 0,
    multaFgts: 0,
    total: 0
  };
  
  const adicionais = calculos.adicionais || {
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
    seguroDesemprego: 0
  };
  
  // Calcular o total geral
  const totalAdicionais = 
    adicionais.adicionalInsalubridade +
    adicionais.adicionalPericulosidade +
    adicionais.multa467 +
    adicionais.multa477 +
    adicionais.adicionalNoturno +
    adicionais.horasExtras +
    adicionais.feriasVencidas +
    adicionais.indenizacaoDemissao +
    adicionais.valeTransporte +
    adicionais.valeAlimentacao +
    adicionais.adicionalTransferencia +
    adicionais.descontosIndevidos +
    adicionais.diferencasSalariais +
    adicionais.customCalculo +
    adicionais.seguroDesemprego;

  const totalGeral = calculos.totalGeral || verbasRescisorias.total + totalAdicionais;

  // Preparando os itens para a tabela
  const itensVerbaRescisoria = [
    { descricao: 'Saldo de Salário', valor: verbasRescisorias.saldoSalario },
    { descricao: 'Aviso Prévio', valor: verbasRescisorias.avisoPrevia },
    { descricao: '13º Salário Proporcional', valor: verbasRescisorias.decimoTerceiro },
    { descricao: 'Férias Proporcionais', valor: verbasRescisorias.ferias },
    { descricao: '1/3 Constitucional', valor: verbasRescisorias.tercoConstitucional },
    { descricao: 'FGTS sobre verbas', valor: verbasRescisorias.fgts },
    { descricao: 'Multa FGTS (40%)', valor: verbasRescisorias.multaFgts },
  ].filter(item => item.valor > 0);

  const itensAdicionais = [
    { descricao: 'Adicional de Insalubridade', valor: adicionais.adicionalInsalubridade },
    { descricao: 'Adicional de Periculosidade', valor: adicionais.adicionalPericulosidade },
    { descricao: 'Multa Art. 467 da CLT', valor: adicionais.multa467 },
    { descricao: 'Multa Art. 477 da CLT', valor: adicionais.multa477 },
    { descricao: 'Adicional Noturno', valor: adicionais.adicionalNoturno },
    { descricao: 'Horas Extras', valor: adicionais.horasExtras },
    { descricao: 'Férias Vencidas (+ 1/3)', valor: adicionais.feriasVencidas },
    { descricao: 'Indenização por Demissão Indevida', valor: adicionais.indenizacaoDemissao },
    { descricao: 'Vale Transporte Não Pago', valor: adicionais.valeTransporte },
    { descricao: 'Vale Alimentação Não Pago', valor: adicionais.valeAlimentacao },
    { descricao: 'Adicional de Transferência', valor: adicionais.adicionalTransferencia },
    { descricao: 'Descontos Indevidos', valor: adicionais.descontosIndevidos },
    { descricao: 'Diferenças Salariais', valor: adicionais.diferencasSalariais },
    { descricao: 'Seguro Desemprego', valor: adicionais.seguroDesemprego },
  ].filter(item => item.valor > 0);

  // Data da criação dos cálculos
  const dataCalculo = calculos.timestamp ? 
    new Date(calculos.timestamp).toLocaleDateString('pt-BR') : 
    new Date().toLocaleDateString('pt-BR');

  // Verifica se há um nome para os cálculos
  const nomeCalculo = calculos.nome ? `${calculos.nome} - ` : '';

  // Obter o logo da empresa do usuário atual
  const logoUrl = localStorage.getItem('userLogoUrl');
  
  // Obter o nome do escritório do usuário atual ou dos cálculos
  const nomeEscritorio = calculos.nomeEscritorio || localStorage.getItem('userName') || 'JurisCalc Trabalhista';

  // Versão para quando estiver embutido na petição
  if (embutido) {
    return (
      <div className="my-6 print:break-inside-avoid print:page-break-inside-avoid">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold border-b-2 border-juriscalc-navy pb-2">DEMONSTRATIVO DE CÁLCULOS TRABALHISTAS</h3>
          {logoUrl && (
            <img 
              src={logoUrl} 
              alt="Logo" 
              className="h-12 mx-auto my-2" 
            />
          )}
          {nomeCalculo && <p className="font-medium text-sm">{nomeCalculo}</p>}
          <p className="text-xs text-gray-600 mb-2">Gerado em: {dataCalculo}</p>
        </div>
        
        <div className="space-y-4 print:text-sm">
          {itensVerbaRescisoria.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-1 text-juriscalc-navy">1. VERBAS RESCISÓRIAS</h4>
              <table className="w-full border-collapse print:text-xs">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-1 text-left w-2/3 text-sm">Descrição</th>
                    <th className="border border-gray-300 p-1 text-right w-1/3 text-sm">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {itensVerbaRescisoria.map((item, index) => (
                    <tr key={`verbas-${index}`}>
                      <td className="border border-gray-300 p-1 text-sm">{item.descricao}</td>
                      <td className="border border-gray-300 p-1 text-right text-sm">{formatarMoeda(item.valor)}</td>
                    </tr>
                  ))}
                  <tr className="font-bold bg-gray-50">
                    <td className="border border-gray-300 p-1 text-sm">Total Verbas Rescisórias</td>
                    <td className="border border-gray-300 p-1 text-right text-sm">{formatarMoeda(verbasRescisorias.total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {itensAdicionais.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-1 text-juriscalc-navy">2. ADICIONAIS E MULTAS</h4>
              <table className="w-full border-collapse print:text-xs">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-1 text-left w-2/3 text-sm">Descrição</th>
                    <th className="border border-gray-300 p-1 text-right w-1/3 text-sm">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {itensAdicionais.map((item, index) => (
                    <tr key={`adicionais-${index}`}>
                      <td className="border border-gray-300 p-1 text-sm">{item.descricao}</td>
                      <td className="border border-gray-300 p-1 text-right text-sm">{formatarMoeda(item.valor)}</td>
                    </tr>
                  ))}
                  <tr className="font-bold bg-gray-50">
                    <td className="border border-gray-300 p-1 text-sm">Total Adicionais</td>
                    <td className="border border-gray-300 p-1 text-right text-sm">{formatarMoeda(totalAdicionais)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          <div className="bg-juriscalc-navy p-2 rounded-md text-white mt-2">
            <div className="text-center">
              <p className="text-xs font-medium">VALOR TOTAL DA RECLAMAÇÃO</p>
              <p className="text-base font-bold">
                {formatarMoeda(totalGeral)}
              </p>
            </div>
          </div>
          
          <div className="text-center text-xs text-gray-500 border-t mt-2 pt-1">
            <p>Cálculos: <span className="font-medium">{nomeEscritorio}</span></p>
          </div>
        </div>
      </div>
    );
  }

  // Versão normal para exibição fora da petição
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {logoUrl && (
              <img 
                src={logoUrl} 
                alt="Logo" 
                className="h-10 mr-3" 
              />
            )}
            <div>
              <CardTitle className="text-xl">Cálculos Trabalhistas</CardTitle>
              <CardDescription>{nomeCalculo}Gerado em: {dataCalculo}</CardDescription>
            </div>
          </div>
          <Button 
            onClick={onInserirNoPeticao} 
            className="bg-juriscalc-gold text-juriscalc-navy hover:bg-opacity-90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Inserir na Petição
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {itensVerbaRescisoria.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Verbas Rescisórias</h3>
              <Table className="print:w-full print:border-collapse keep-together">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-2/3">Descrição</TableHead>
                    <TableHead className="text-right w-1/3">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itensVerbaRescisoria.map((item, index) => (
                    <TableRow key={`verbas-${index}`}>
                      <TableCell>{item.descricao}</TableCell>
                      <TableCell className="text-right">{formatarMoeda(item.valor)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold">
                    <TableCell>Total Verbas Rescisórias</TableCell>
                    <TableCell className="text-right">{formatarMoeda(calculos.verbasRescisorias.total)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}

          {itensAdicionais.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Adicionais e Multas</h3>
              <Table className="print:w-full print:border-collapse keep-together">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-2/3">Descrição</TableHead>
                    <TableHead className="text-right w-1/3">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itensAdicionais.map((item, index) => (
                    <TableRow key={`adicionais-${index}`}>
                      <TableCell>{item.descricao}</TableCell>
                      <TableCell className="text-right">{formatarMoeda(item.valor)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold">
                    <TableCell>Total Adicionais</TableCell>
                    <TableCell className="text-right">{formatarMoeda(totalAdicionais)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}

          <div className="bg-juriscalc-navy p-4 rounded-md text-white">
            <div className="text-center">
              <p className="text-sm font-medium mb-2">Valor Total da Reclamação</p>
              <p className="text-2xl font-bold">
                {formatarMoeda(calculos.totalGeral)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-center text-sm text-gray-500 pt-2 border-t">
        <p className="w-full">Cálculos realizados por: <span className="font-medium">{nomeEscritorio}</span></p>
      </CardFooter>
    </Card>
  );
};

export default TabelaCalculos;
