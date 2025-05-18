
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import TabelaHeader from './components/TabelaHeader';
import TabelaVerbaRescisoria from './components/TabelaVerbaRescisoria';
import TabelaAdicionais from './components/TabelaAdicionais';
import TabelaTotal from './components/TabelaTotal';

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

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <TabelaHeader 
          onInserirNoPeticao={onInserirNoPeticao}
          logoUrl={logoUrl}
          nomeCalculo={nomeCalculo}
          dataCalculo={dataCalculo}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <TabelaVerbaRescisoria verbasRescisorias={verbasRescisorias} />
          
          <TabelaAdicionais 
            adicionais={adicionais} 
            calculosCustom={calculos.calculosCustom}
            descricaoCustom={calculos.descricaoCustom}
          />
          
          <TabelaTotal totalGeral={calculos.totalGeral} />
        </div>
      </CardContent>
      <CardFooter className="text-center text-sm text-gray-500 pt-2 border-t">
        <p className="w-full">Cálculos realizados por: <span className="font-medium">{nomeEscritorio}</span></p>
      </CardFooter>
    </Card>
  );
};

export default TabelaCalculosPadrao;
