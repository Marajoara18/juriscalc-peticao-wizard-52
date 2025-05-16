
import React from 'react';
import TabelaCalculosPadrao from './tabelas/TabelaCalculosPadrao';
import TabelaCalculosEmbutida from './tabelas/TabelaCalculosEmbutida';
import TabelaCalculosMensagemVazia from './tabelas/TabelaCalculosMensagemVazia';
import { calculosValidos, prepararMetadados } from '@/utils/calculosUtils';

interface TabelaCalculosProps {
  calculos: any;
  onInserirNoPeticao: () => void;
  embutido?: boolean; // Prop para indicar se está embutido na petição
}

const TabelaCalculos: React.FC<TabelaCalculosProps> = ({ 
  calculos, 
  onInserirNoPeticao, 
  embutido = false 
}) => {
  // Verifica se existem cálculos válidos para exibir
  if (!calculosValidos(calculos)) {
    return <TabelaCalculosMensagemVazia />;
  }

  // Preparar metadados comuns para os dois tipos de visualização
  const { dataCalculo, nomeCalculo, logoUrl, nomeEscritorio } = prepararMetadados(calculos);
  
  // Versão para quando estiver embutido na petição
  if (embutido) {
    return (
      <TabelaCalculosEmbutida 
        calculos={calculos}
        logoUrl={logoUrl}
        nomeEscritorio={nomeEscritorio}
        dataCalculo={dataCalculo}
        nomeCalculo={nomeCalculo}
      />
    );
  }

  // Versão normal para exibição fora da petição
  return (
    <TabelaCalculosPadrao 
      calculos={calculos}
      onInserirNoPeticao={onInserirNoPeticao}
      logoUrl={logoUrl}
      nomeEscritorio={nomeEscritorio}
      dataCalculo={dataCalculo}
      nomeCalculo={nomeCalculo}
    />
  );
};

export default TabelaCalculos;
