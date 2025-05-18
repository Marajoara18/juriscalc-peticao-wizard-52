
import React from 'react';
import { formatarMoeda } from '@/utils/formatters';

interface TabelaCalculosEmbutidaProps {
  calculos: any;
  logoUrl?: string | null;
  nomeEscritorio: string;
  dataCalculo: string;
  nomeCalculo?: string;
}

const TabelaCalculosEmbutida: React.FC<TabelaCalculosEmbutidaProps> = ({
  calculos,
  logoUrl,
  nomeEscritorio,
  dataCalculo,
  nomeCalculo = '',
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
  
  // Calcular o total de adicionais
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

  return (
    <div className="my-6 print:break-inside-avoid print:page-break-inside-avoid">
      <div className="text-center mb-4">
        {logoUrl && (
          <img 
            src={logoUrl} 
            alt="Logo" 
            className="h-12 mx-auto my-2" 
          />
        )}
        <h3 className="text-xl font-bold border-b-2 border-juriscalc-navy pb-2">DEMONSTRATIVO DE CÁLCULOS TRABALHISTAS</h3>
        {/* Removed the calculation name from print view */}
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
          <div className="flex items-center justify-center mt-1">
            <img 
              src="/lovable-uploads/caf683c7-0cb3-4ef4-8e5f-5de22f996b8a.png"
              alt="Logo" 
              className="h-5 mr-1" 
            />
            <p className="font-serif font-bold text-xs text-juriscalc-navy">IusCalc</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabelaCalculosEmbutida;
