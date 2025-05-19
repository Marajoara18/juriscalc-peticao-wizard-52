
import React from 'react';
import { formatarMoeda, formatarData } from '@/utils/formatters';

interface PrintVersionCalculadoraProps {
  resultados: any;
}

const PrintVersionCalculadora: React.FC<PrintVersionCalculadoraProps> = ({ resultados }) => {
  // Não renderizar nada se não houver resultados
  if (!resultados || (!resultados.verbasRescisorias && !resultados.adicionais)) {
    return null;
  }

  // Calcular o total geral (soma das verbas rescisórias e adicionais)
  const totalVerbas = resultados.verbasRescisorias?.total || 0;
  const totalAdicionais = Object.values(resultados.adicionais || {}).reduce(
    (sum: number, valor: any) => sum + (typeof valor === 'number' ? valor : 0), 
    0
  );
  const totalGeral = totalVerbas + totalAdicionais;

  // Dados necessários para o demonstrativo
  const nomeEscritorio = localStorage.getItem('userName') || 'Administrador';
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  
  // Filtrar apenas verbas rescisórias com valores positivos
  const verbas = resultados.verbasRescisorias || {};
  const verbasPositivas = Object.entries(verbas)
    .filter(([chave, valor]) => 
      typeof valor === 'number' && 
      valor > 0 && 
      chave !== 'total' && 
      chave !== 'descontoAvisoPrevio'
    )
    .map(([chave, valor]) => ({
      descricao: 
        chave === 'saldoSalario' ? 'Saldo de Salário' :
        chave === 'avisoPrevia' ? 'Aviso Prévio' :
        chave === 'decimoTerceiro' ? '13º Salário Proporcional' :
        chave === 'ferias' ? 'Férias Proporcionais' :
        chave === 'tercoConstitucional' ? '1/3 Constitucional' :
        chave === 'fgts' ? 'FGTS sobre verbas' :
        chave === 'multaFgts' ? 'Multa FGTS (40%)' : chave,
      valor: valor as number
    }));

  return (
    <div className="hidden print:block print:p-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-center text-xl font-bold mb-2">DEMONSTRATIVO DE CÁLCULOS TRABALHISTAS</h2>
        <div className="border-b-2 border-gray-800 mb-2"></div>
        <div className="text-right mb-4 text-sm">Gerado em: {dataAtual}</div>
        
        <div className="mb-8">
          <h3 className="font-bold mb-2">1. VERBAS RESCISÓRIAS</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-700 p-2 text-left">Descrição</th>
                <th className="border border-gray-700 p-2 text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              {verbasPositivas.map((item, index) => (
                <tr key={`verbas-${index}`}>
                  <td className="border border-gray-700 p-2">{item.descricao}</td>
                  <td className="border border-gray-700 p-2 text-right">{formatarMoeda(item.valor)}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td className="border border-gray-700 p-2">Total Verbas Rescisórias</td>
                <td className="border border-gray-700 p-2 text-right">{formatarMoeda(verbas.total || 0)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="bg-juriscalc-navy text-white p-4 mb-4 rounded-md">
          <div className="text-center">
            <p className="mb-1 uppercase font-medium text-sm">VALOR TOTAL DA RECLAMAÇÃO</p>
            <p className="text-xl font-bold">{formatarMoeda(totalGeral)}</p>
          </div>
        </div>
        
        <div className="text-center text-sm">
          <p>Cálculos: {nomeEscritorio}</p>
          <div className="flex items-center justify-center mt-1">
            <img 
              src="/lovable-uploads/caf683c7-0cb3-4ef4-8e5f-5de22f996b8a.png"
              alt="Logo" 
              className="h-5 mr-1" 
            />
            <p className="font-serif font-bold">IusCalc</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintVersionCalculadora;
