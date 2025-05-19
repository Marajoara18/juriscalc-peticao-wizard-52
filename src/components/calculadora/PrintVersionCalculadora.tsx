
import React from 'react';
import { formatarMoeda, formatarData } from '@/utils/formatters';

interface PrintVersionCalculadoraProps {
  resultados: any;
  dadosContrato?: any;
}

const PrintVersionCalculadora: React.FC<PrintVersionCalculadoraProps> = ({ resultados, dadosContrato }) => {
  // Não renderizar nada se não houver resultados
  if (!resultados || (!resultados.verbasRescisorias && !resultados.adicionais)) {
    return null;
  }

  // Calcular o total geral (soma das verbas rescisórias e adicionais)
  const verbas = resultados.verbasRescisorias || {};
  const adicionais = resultados.adicionais || {};
  
  const totalVerbas = verbas.total || 0;
  const totalAdicionais = Object.entries(adicionais)
    .filter(([key, value]) => typeof value === 'number' && value > 0 && key !== 'total' && key !== 'honorariosAdvocaticios')
    .reduce((sum, [_, value]) => sum + (value as number), 0);
  
  const totalGeral = totalVerbas + totalAdicionais;

  return (
    <div className="hidden print:block print:p-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-center text-xl font-bold mb-4">Calculadora de Verbas Trabalhistas</h2>
        
        {/* Dados de Entrada */}
        {dadosContrato && (
          <div className="mb-6 border rounded-md p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Data de Admissão</h4>
                <p className="border rounded-md p-2">{dadosContrato.dataAdmissao || '-'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Data de Demissão</h4>
                <p className="border rounded-md p-2">{dadosContrato.dataDemissao || '-'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Salário Base (R$)</h4>
                <p className="border rounded-md p-2">{formatarMoeda(parseFloat(dadosContrato.salarioBase) || 0)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Tipo de Rescisão</h4>
                <p className="border rounded-md p-2">
                  {dadosContrato.tipoRescisao === 'sem_justa_causa' ? 'Demissão sem Justa Causa' : 
                   dadosContrato.tipoRescisao === 'pedido_demissao' ? 'Pedido de Demissão' : 
                   dadosContrato.tipoRescisao === 'justa_causa' ? 'Demissão por Justa Causa' :
                   dadosContrato.tipoRescisao === 'rescisao_indireta' ? 'Rescisão Indireta' : 
                   'Não especificado'}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Dias Trabalhados no último mês</h4>
                <p className="border rounded-md p-2">{dadosContrato.diasTrabalhados || '0'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Total de Meses Trabalhados</h4>
                <p className="border rounded-md p-2">{dadosContrato.mesesTrabalhados || '0'}</p>
              </div>
            </div>
            <div className="mt-4">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={dadosContrato.avisoPrevioCumprido || false} 
                  readOnly 
                  className="mr-2" 
                />
                <span>Aviso Prévio Cumprido</span>
              </label>
            </div>
          </div>
        )}
        
        {/* Resultados do Cálculo */}
        <div className="mb-6 border rounded-md p-4">
          <h3 className="text-lg font-bold mb-4">Resultados do Cálculo</h3>
          
          {/* Verbas Rescisórias */}
          <div className="mb-4">
            <h4 className="text-md font-bold mb-2">Verbas Rescisórias</h4>
            <div className="space-y-2">
              {verbas.saldoSalario > 0 && (
                <div className="flex justify-between">
                  <span>Saldo de Salário</span>
                  <span>{formatarMoeda(verbas.saldoSalario)}</span>
                </div>
              )}
              {verbas.avisoPrevia > 0 && (
                <div className="flex justify-between">
                  <span>Aviso Prévio</span>
                  <span>{formatarMoeda(verbas.avisoPrevia)}</span>
                </div>
              )}
              {verbas.decimoTerceiro > 0 && (
                <div className="flex justify-between">
                  <span>13º Salário Proporcional</span>
                  <span>{formatarMoeda(verbas.decimoTerceiro)}</span>
                </div>
              )}
              {verbas.ferias > 0 && (
                <div className="flex justify-between">
                  <span>Férias Proporcionais</span>
                  <span>{formatarMoeda(verbas.ferias)}</span>
                </div>
              )}
              {verbas.tercoConstitucional > 0 && (
                <div className="flex justify-between">
                  <span>1/3 Constitucional</span>
                  <span>{formatarMoeda(verbas.tercoConstitucional)}</span>
                </div>
              )}
              {verbas.fgts > 0 && (
                <div className="flex justify-between">
                  <span>FGTS sobre verbas</span>
                  <span>{formatarMoeda(verbas.fgts)}</span>
                </div>
              )}
              {verbas.multaFgts > 0 && (
                <div className="flex justify-between">
                  <span>Multa FGTS (40%)</span>
                  <span>{formatarMoeda(verbas.multaFgts)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold border-t pt-1">
                <span>Total Verbas Rescisórias</span>
                <span>{formatarMoeda(verbas.total || 0)}</span>
              </div>
            </div>
          </div>
          
          {/* Adicionais e Multas - apenas se houver */}
          {Object.values(adicionais).some(value => typeof value === 'number' && value > 0) && (
            <div className="mb-4">
              <h4 className="text-md font-bold mb-2">Adicionais e Multas</h4>
              <div className="space-y-2">
                {adicionais.adicionalInsalubridade > 0 && (
                  <div className="flex justify-between">
                    <span>Adicional de Insalubridade</span>
                    <span>{formatarMoeda(adicionais.adicionalInsalubridade)}</span>
                  </div>
                )}
                {adicionais.adicionalPericulosidade > 0 && (
                  <div className="flex justify-between">
                    <span>Adicional de Periculosidade</span>
                    <span>{formatarMoeda(adicionais.adicionalPericulosidade)}</span>
                  </div>
                )}
                {adicionais.multa467 > 0 && (
                  <div className="flex justify-between">
                    <span>Multa do Art. 467 CLT</span>
                    <span>{formatarMoeda(adicionais.multa467)}</span>
                  </div>
                )}
                {adicionais.multa477 > 0 && (
                  <div className="flex justify-between">
                    <span>Multa do Art. 477 CLT</span>
                    <span>{formatarMoeda(adicionais.multa477)}</span>
                  </div>
                )}
                {adicionais.adicionalNoturno > 0 && (
                  <div className="flex justify-between">
                    <span>Adicional Noturno</span>
                    <span>{formatarMoeda(adicionais.adicionalNoturno)}</span>
                  </div>
                )}
                {adicionais.horasExtras > 0 && (
                  <div className="flex justify-between">
                    <span>Horas Extras</span>
                    <span>{formatarMoeda(adicionais.horasExtras)}</span>
                  </div>
                )}
                {adicionais.feriasVencidas > 0 && (
                  <div className="flex justify-between">
                    <span>Férias Vencidas</span>
                    <span>{formatarMoeda(adicionais.feriasVencidas)}</span>
                  </div>
                )}
                {adicionais.indenizacaoDemissao > 0 && (
                  <div className="flex justify-between">
                    <span>Indenização por Demissão</span>
                    <span>{formatarMoeda(adicionais.indenizacaoDemissao)}</span>
                  </div>
                )}
                {adicionais.valeTransporte > 0 && (
                  <div className="flex justify-between">
                    <span>Vale Transporte</span>
                    <span>{formatarMoeda(adicionais.valeTransporte)}</span>
                  </div>
                )}
                {adicionais.valeAlimentacao > 0 && (
                  <div className="flex justify-between">
                    <span>Vale Alimentação</span>
                    <span>{formatarMoeda(adicionais.valeAlimentacao)}</span>
                  </div>
                )}
                {adicionais.adicionalTransferencia > 0 && (
                  <div className="flex justify-between">
                    <span>Adicional de Transferência</span>
                    <span>{formatarMoeda(adicionais.adicionalTransferencia)}</span>
                  </div>
                )}
                {adicionais.descontosIndevidos > 0 && (
                  <div className="flex justify-between">
                    <span>Descontos Indevidos</span>
                    <span>{formatarMoeda(adicionais.descontosIndevidos)}</span>
                  </div>
                )}
                {adicionais.diferencasSalariais > 0 && (
                  <div className="flex justify-between">
                    <span>Diferenças Salariais</span>
                    <span>{formatarMoeda(adicionais.diferencasSalariais)}</span>
                  </div>
                )}
                {adicionais.customCalculo > 0 && (
                  <div className="flex justify-between">
                    <span>Cálculo Personalizado</span>
                    <span>{formatarMoeda(adicionais.customCalculo)}</span>
                  </div>
                )}
                {adicionais.seguroDesemprego > 0 && (
                  <div className="flex justify-between">
                    <span>Seguro Desemprego</span>
                    <span>{formatarMoeda(adicionais.seguroDesemprego)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold border-t pt-1">
                  <span>Total Adicionais</span>
                  <span>{formatarMoeda(totalAdicionais)}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Subtotal */}
          <div className="flex justify-between font-bold mb-4">
            <span>Subtotal</span>
            <span>{formatarMoeda(totalGeral)}</span>
          </div>
          
          {/* Valor Total */}
          <div className="bg-juriscalc-navy text-white p-4 mb-4 rounded-md">
            <div className="flex justify-between">
              <span className="font-bold">TOTAL GERAL</span>
              <span className="font-bold">{formatarMoeda(totalGeral)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintVersionCalculadora;
