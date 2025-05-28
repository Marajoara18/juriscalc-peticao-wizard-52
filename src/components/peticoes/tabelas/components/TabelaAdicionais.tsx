
import React from 'react';
import { formatarMoeda } from '@/utils/formatters';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TabelaAdicionaisProps {
  adicionais: Record<string, number>;
  calculosCustom?: any[];
  descricaoCustom?: string;
}

const TabelaAdicionais: React.FC<TabelaAdicionaisProps> = ({ 
  adicionais, 
  calculosCustom, 
  descricaoCustom 
}) => {
  // Preparar lista de itens adicionais (excluindo cálculos personalizados)
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
    { descricao: 'Salário Família', valor: adicionais.salarioFamilia || 0 },
  ].filter(item => item.valor > 0);

  // Adicionar cálculos personalizados com suas descrições específicas
  const calculosCustomAMostrar = [];
  if (calculosCustom && calculosCustom.length > 0) {
    calculosCustom.forEach((calculo) => {
      if (calculo.valor && parseFloat(calculo.valor) > 0) {
        calculosCustomAMostrar.push({
          descricao: calculo.descricao || 'Cálculo Personalizado',
          valor: parseFloat(calculo.valor)
        });
      }
    });
  } else if (adicionais.customCalculo > 0) {
    // Fallback para o sistema antigo
    calculosCustomAMostrar.push({
      descricao: descricaoCustom || 'Cálculo Personalizado',
      valor: adicionais.customCalculo
    });
  }

  // Combinar todos os itens
  const todosItens = [...itensAdicionais, ...calculosCustomAMostrar];

  if (todosItens.length === 0) {
    return null;
  }

  // Calcular total
  const totalAdicionais = todosItens.reduce((acc, item) => acc + item.valor, 0);

  return (
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
          {todosItens.map((item, index) => (
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
  );
};

export default TabelaAdicionais;
