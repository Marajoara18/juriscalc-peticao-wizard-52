
import React from 'react';
import { Button } from "@/components/ui/button";
import { formatarMoeda } from '@/utils/formatters';
import { TipoIndiceCorrecao } from '@/data/indicesCorrecao';

interface ResultadoCorrecaoProps {
  valorCorrigido: number;
  valorOriginal: string;
  indiceCorrecao: TipoIndiceCorrecao;
  dataInicio: string;
  onAplicarCorrecao: () => void;
  usarTotalGeral: boolean;
  totalGeral?: number;
  aplicarJurosMora?: boolean;
  taxaJurosMora?: string;
}

const ResultadoCorrecao: React.FC<ResultadoCorrecaoProps> = ({
  valorCorrigido,
  valorOriginal,
  indiceCorrecao,
  dataInicio,
  onAplicarCorrecao,
  usarTotalGeral,
  totalGeral = 0,
  aplicarJurosMora = false,
  taxaJurosMora = "1"
}) => {
  // Calcular diferença percentual
  const valorOriginalNumerico = usarTotalGeral ? totalGeral : parseFloat(valorOriginal.replace(/\./g, '').replace(',', '.'));
  const diferencaPercentual = ((valorCorrigido - valorOriginalNumerico) / valorOriginalNumerico) * 100;
  
  return (
    <div className="pt-2 border-t border-gray-200 mt-4">
      <div className="bg-gray-50 rounded-md p-4">
        <h3 className="font-medium text-lg mb-2">Resultado:</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span>Valor original:</span>
          <span className="font-medium text-right">
            {usarTotalGeral && totalGeral > 0 ? formatarMoeda(totalGeral) : valorOriginal}
          </span>
          
          <span>Índice aplicado:</span>
          <span className="font-medium text-right">{indiceCorrecao}</span>
          
          <span>Data inicial:</span>
          <span className="font-medium text-right">{dataInicio}</span>
          
          {aplicarJurosMora && (
            <>
              <span>Juros de mora:</span>
              <span className="font-medium text-right">{taxaJurosMora}% ao mês</span>
            </>
          )}
          
          <span>Valor corrigido:</span>
          <span className="font-bold text-right text-juriscalc-navy">
            {formatarMoeda(valorCorrigido)}
          </span>
          
          <span>Diferença:</span>
          <span className={`font-medium text-right ${diferencaPercentual > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatarMoeda(valorCorrigido - valorOriginalNumerico)} ({diferencaPercentual.toFixed(2)}%)
          </span>
        </div>
        
        <div className="mt-4">
          <Button 
            onClick={onAplicarCorrecao}
            className="w-full bg-juriscalc-gold text-juriscalc-navy hover:bg-opacity-90"
          >
            Atualizar com Correção Monetária
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultadoCorrecao;
