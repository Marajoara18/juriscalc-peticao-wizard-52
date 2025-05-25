
import React from 'react';
import { formatarMoeda } from '@/utils/formatters';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TabelaVerbaRescisoriasProps {
  verbasRescisorias: {
    saldoSalario: number;
    avisoPrevia: number;
    descontoAvisoPrevio?: number;
    feriasAvisoPrevia: number;
    decimoTerceiroAvisoPrevia: number;
    decimoTerceiro: number;
    ferias: number;
    tercoConstitucional: number;
    fgts: number;
    multaFgts: number;
    total: number;
  };
  tipoRescisao?: string;
}

const TabelaVerbaRescisoria: React.FC<TabelaVerbaRescisoriasProps> = ({ 
  verbasRescisorias,
  tipoRescisao = 'sem_justa_causa'
}) => {
  // Itens das verbas principais
  const itensVerbaRescisoria = [
    { descricao: 'Saldo de Salário', valor: verbasRescisorias.saldoSalario },
    { descricao: 'Aviso Prévio Indenizado', valor: verbasRescisorias.avisoPrevia },
  ].filter(item => item.valor > 0);

  // Valores proporcionais ao aviso prévio com descrições detalhadas
  const valoresAvisoPrevia = [];
  
  if (verbasRescisorias.decimoTerceiroAvisoPrevia > 0) {
    valoresAvisoPrevia.push({
      descricao: '13º Proporcional do Aviso Prévio',
      descricaoDetalhada: 'Valor referente ao 13º salário proporcional ao período do aviso prévio.',
      itemDescricao: '13º salário proporcional ao aviso prévio',
      valor: verbasRescisorias.decimoTerceiroAvisoPrevia
    });
  }
  
  if (verbasRescisorias.feriasAvisoPrevia > 0) {
    valoresAvisoPrevia.push({
      descricao: 'Férias Indenizadas do Aviso Prévio',
      descricaoDetalhada: 'Valor referente às férias proporcionais ao período do aviso prévio.',
      itemDescricao: 'Férias proporcionais ao aviso prévio',
      valor: verbasRescisorias.feriasAvisoPrevia
    });
  }

  // Valores proporcionais gerais com descrições detalhadas
  const valoresProporcionaisGerais = [];
  
  if (verbasRescisorias.decimoTerceiro > 0) {
    valoresProporcionaisGerais.push({
      descricao: '13º Salário Proporcional',
      descricaoDetalhada: 'Valor referente ao 13º salário proporcional, sem considerar o aviso prévio.',
      valor: verbasRescisorias.decimoTerceiro
    });
  }
  
  if (verbasRescisorias.ferias > 0) {
    valoresProporcionaisGerais.push({
      descricao: 'Férias Proporcionais',
      descricaoDetalhada: 'Valor referente às férias proporcionais, sem considerar o aviso prévio.',
      valor: verbasRescisorias.ferias
    });
  }

  // Valores do FGTS
  const valoresFgts = [
    { descricao: '1/3 Constitucional', valor: verbasRescisorias.tercoConstitucional },
    { descricao: 'FGTS sobre verbas', valor: verbasRescisorias.fgts },
    { descricao: 'Multa FGTS (40%)', valor: verbasRescisorias.multaFgts },
  ].filter(item => item.valor > 0);

  // Verificar se há desconto de aviso prévio
  const temDescontoAvisoPrevio = verbasRescisorias.descontoAvisoPrevio && verbasRescisorias.descontoAvisoPrevio > 0;

  // Se não há nenhum valor para exibir
  if (itensVerbaRescisoria.length === 0 && valoresAvisoPrevia.length === 0 && 
      valoresProporcionaisGerais.length === 0 && valoresFgts.length === 0 && !temDescontoAvisoPrevio) {
    return null;
  }

  // Calcular total final considerando possível desconto
  const totalFinal = verbasRescisorias.total - (verbasRescisorias.descontoAvisoPrevio || 0);

  return (
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
          {/* Verbas principais */}
          {itensVerbaRescisoria.map((item, index) => (
            <TableRow key={`verbas-principais-${index}`}>
              <TableCell>{item.descricao}</TableCell>
              <TableCell className="text-right">{formatarMoeda(item.valor)}</TableCell>
            </TableRow>
          ))}
          
          {/* Valores proporcionais ao aviso prévio com descrições detalhadas */}
          {valoresAvisoPrevia.map((item, index) => (
            <React.Fragment key={`aviso-previa-${index}`}>
              <TableRow className="bg-blue-50">
                <TableCell colSpan={2} className="text-sm italic text-blue-600 font-medium">
                  {item.descricao}: {item.descricaoDetalhada}
                </TableCell>
              </TableRow>
              <TableRow className="bg-blue-50">
                <TableCell className="pl-8 italic">{item.itemDescricao}</TableCell>
                <TableCell className="text-right">{formatarMoeda(item.valor)}</TableCell>
              </TableRow>
            </React.Fragment>
          ))}
          
          {/* Valores proporcionais gerais com descrições detalhadas */}
          {valoresProporcionaisGerais.map((item, index) => (
            <React.Fragment key={`proporcionais-gerais-${index}`}>
              <TableRow className="bg-gray-50">
                <TableCell colSpan={2} className="text-sm italic text-gray-600 font-medium">
                  {item.descricao}: {item.descricaoDetalhada}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{item.descricao}</TableCell>
                <TableCell className="text-right">{formatarMoeda(item.valor)}</TableCell>
              </TableRow>
            </React.Fragment>
          ))}
          
          {/* Valores do FGTS */}
          {valoresFgts.map((item, index) => (
            <TableRow key={`fgts-${index}`}>
              <TableCell>{item.descricao}</TableCell>
              <TableCell className="text-right">{formatarMoeda(item.valor)}</TableCell>
            </TableRow>
          ))}
          
          {/* Mostrar desconto do aviso prévio quando aplicável */}
          {temDescontoAvisoPrevio && (
            <TableRow className="text-red-600">
              <TableCell>Desconto Aviso Prévio não cumprido</TableCell>
              <TableCell className="text-right">- {formatarMoeda(verbasRescisorias.descontoAvisoPrevio || 0)}</TableCell>
            </TableRow>
          )}
          
          <TableRow className="font-bold">
            <TableCell>Total Verbas Rescisórias</TableCell>
            <TableCell className="text-right">{formatarMoeda(totalFinal)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default TabelaVerbaRescisoria;
