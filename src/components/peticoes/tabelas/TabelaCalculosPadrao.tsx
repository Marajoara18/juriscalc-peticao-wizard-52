import React from 'react';
import { formatarMoeda } from '@/utils/formatters';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";

interface TabelaCalculosPadraoProps {
  calculos: any;
  onInserirNoPeticao: () => void;
  logoUrl?: string | null;
  nomeEscritorio: string;
  dataCalculo: string;
  nomeCalculo: string;
}

const TabelaCalculosPadrao: React.FC<TabelaCalculosPadraoProps> = ({
  calculos,
  onInserirNoPeticao,
  logoUrl,
  nomeEscritorio,
  dataCalculo,
  nomeCalculo
}) => {
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

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/caf683c7-0cb3-4ef4-8e5f-5de22f996b8a.png"
              alt="IusCalc Logo" 
              className="h-10 mr-3" 
            />
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

export default TabelaCalculosPadrao;
