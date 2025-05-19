
import React from 'react';
import { formatarMoeda } from '@/utils/formatters';

interface PrintAdicionaisProps {
  adicionais: any;
}

const PrintAdicionais: React.FC<PrintAdicionaisProps> = ({ adicionais }) => {
  if (!adicionais) return null;
  
  // Calcular o total de adicionais
  const totalAdicionais = Object.entries(adicionais)
    .filter(([key, value]) => 
      typeof value === 'number' && 
      value > 0 && 
      key !== 'total' && 
      key !== 'honorariosAdvocaticios'
    )
    .reduce((sum, [_, value]) => sum + (value as number), 0);
    
  // Se não houver adicionais com valor positivo, não mostrar a seção
  if (totalAdicionais <= 0) return null;
  
  return (
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
  );
};

export default PrintAdicionais;
