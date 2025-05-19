
import React from 'react';
import { Adicionais } from '@/types/calculadora';
import FeriasVencidas from './verbas/FeriasVencidas';
import IndenizacaoDemissao from './verbas/IndenizacaoDemissao';
import ValeTransporte from './verbas/ValeTransporte';
import ValeAlimentacao from './verbas/ValeAlimentacao';
import AdicionalTransferencia from './verbas/AdicionalTransferencia';
import DescontosIndevidos from './verbas/DescontosIndevidos';
import DiferencasSalariais from './verbas/DiferencasSalariais';

interface VerbasAdicionaisProps {
  adicionais: Adicionais;
  onChange: (name: string, value: string | boolean) => void;
}

export const VerbasAdicionais: React.FC<VerbasAdicionaisProps> = ({ adicionais, onChange }) => {
  return (
    <>
      <FeriasVencidas
        calcularFeriasVencidas={adicionais.calcularFeriasVencidas}
        periodosFeriasVencidas={adicionais.periodosFeriasVencidas}
        onChange={onChange}
      />
      
      <IndenizacaoDemissao
        calcularIndenizacaoDemissao={adicionais.calcularIndenizacaoDemissao}
        valorIndenizacaoDemissao={adicionais.valorIndenizacaoDemissao}
        onChange={onChange}
      />
      
      <ValeTransporte
        calcularValeTransporte={adicionais.calcularValeTransporte}
        valorDiarioVT={adicionais.valorDiarioVT}
        diasValeTransporte={adicionais.diasValeTransporte}
        onChange={onChange}
      />
      
      <ValeAlimentacao
        calcularValeAlimentacao={adicionais.calcularValeAlimentacao}
        valorDiarioVA={adicionais.valorDiarioVA}
        diasValeAlimentacao={adicionais.diasValeAlimentacao}
        onChange={onChange}
      />
      
      <AdicionalTransferencia
        calcularAdicionalTransferencia={adicionais.calcularAdicionalTransferencia}
        percentualAdicionalTransferencia={adicionais.percentualAdicionalTransferencia}
        onChange={onChange}
      />
      
      <DescontosIndevidos
        calcularDescontosIndevidos={adicionais.calcularDescontosIndevidos}
        valorDescontosIndevidos={adicionais.valorDescontosIndevidos}
        onChange={onChange}
      />
      
      <DiferencasSalariais
        calcularDiferencasSalariais={adicionais.calcularDiferencasSalariais}
        valorDiferencasSalariais={adicionais.valorDiferencasSalariais}
        onChange={onChange}
      />
    </>
  );
};
