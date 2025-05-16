
import React from 'react';
import { formatarMoeda } from '@/utils/formatters';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";

interface TabelaCalculosProps {
  calculos: any;
  onInserirNoPeticao: () => void;
}

const TabelaCalculos: React.FC<TabelaCalculosProps> = ({ calculos, onInserirNoPeticao }) => {
  if (!calculos) {
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

  // Calcular o total geral
  const totalAdicionais = 
    calculos.adicionais.adicionalInsalubridade +
    calculos.adicionais.adicionalPericulosidade +
    calculos.adicionais.multa467 +
    calculos.adicionais.multa477 +
    calculos.adicionais.adicionalNoturno +
    calculos.adicionais.horasExtras +
    calculos.adicionais.feriasVencidas +
    calculos.adicionais.indenizacaoDemissao +
    calculos.adicionais.valeTransporte +
    calculos.adicionais.valeAlimentacao +
    calculos.adicionais.adicionalTransferencia +
    calculos.adicionais.descontosIndevidos +
    calculos.adicionais.diferencasSalariais +
    calculos.adicionais.customCalculo;

  // Preparando os itens para a tabela
  const itensVerbaRescisoria = [
    { descricao: 'Saldo de Salário', valor: calculos.verbasRescisorias.saldoSalario },
    { descricao: 'Aviso Prévio', valor: calculos.verbasRescisorias.avisoPrevia },
    { descricao: '13º Salário Proporcional', valor: calculos.verbasRescisorias.decimoTerceiro },
    { descricao: 'Férias Proporcionais', valor: calculos.verbasRescisorias.ferias },
    { descricao: '1/3 Constitucional', valor: calculos.verbasRescisorias.tercoConstitucional },
    { descricao: 'FGTS sobre verbas', valor: calculos.verbasRescisorias.fgts },
    { descricao: 'Multa FGTS (40%)', valor: calculos.verbasRescisorias.multaFgts },
  ].filter(item => item.valor > 0);

  const itensAdicionais = [
    { descricao: 'Adicional de Insalubridade', valor: calculos.adicionais.adicionalInsalubridade },
    { descricao: 'Adicional de Periculosidade', valor: calculos.adicionais.adicionalPericulosidade },
    { descricao: 'Multa Art. 467 da CLT', valor: calculos.adicionais.multa467 },
    { descricao: 'Multa Art. 477 da CLT', valor: calculos.adicionais.multa477 },
    { descricao: 'Adicional Noturno', valor: calculos.adicionais.adicionalNoturno },
    { descricao: 'Horas Extras', valor: calculos.adicionais.horasExtras },
    { descricao: 'Férias Vencidas (+ 1/3)', valor: calculos.adicionais.feriasVencidas },
    { descricao: 'Indenização por Demissão Indevida', valor: calculos.adicionais.indenizacaoDemissao },
    { descricao: 'Vale Transporte Não Pago', valor: calculos.adicionais.valeTransporte },
    { descricao: 'Vale Alimentação Não Pago', valor: calculos.adicionais.valeAlimentacao },
    { descricao: 'Adicional de Transferência', valor: calculos.adicionais.adicionalTransferencia },
    { descricao: 'Descontos Indevidos', valor: calculos.adicionais.descontosIndevidos },
    { descricao: 'Diferenças Salariais', valor: calculos.adicionais.diferencasSalariais },
  ].filter(item => item.valor > 0);

  // Data da criação dos cálculos
  const dataCalculo = new Date(calculos.timestamp).toLocaleDateString('pt-BR');

  // Verifica se há um nome para os cálculos
  const nomeCalculo = calculos.nome ? `${calculos.nome} - ` : '';

  // Obter o logo da empresa do usuário atual
  const logoUrl = localStorage.getItem('userLogoUrl');
  
  // Obter o nome do escritório do usuário atual ou dos cálculos
  const nomeEscritorio = calculos.nomeEscritorio || localStorage.getItem('userName') || 'JurisCalc Trabalhista';

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
