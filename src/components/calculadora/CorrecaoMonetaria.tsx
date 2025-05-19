
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

import IndiceSelecao from './correcao-monetaria/IndiceSelecao';
import DataInicioInput from './correcao-monetaria/DataInicioInput';
import ValorInput from './correcao-monetaria/ValorInput';
import ResultadoCorrecao from './correcao-monetaria/ResultadoCorrecao';
import { TipoIndiceCorrecao } from '@/data/indicesCorrecao';
import { useCalculoCorrecao } from '@/hooks/calculadora/useCalculoCorrecao';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface CorrecaoMonetariaProps {
  onAplicarCorrecao: (valorCorrigido: number) => void;
  totalGeral?: number;
  dataAdmissao?: string;
}

const CorrecaoMonetaria: React.FC<CorrecaoMonetariaProps> = ({ 
  onAplicarCorrecao, 
  totalGeral = 0,
  dataAdmissao = ''
}) => {
  const [indiceCorrecao, setIndiceCorrecao] = useState<TipoIndiceCorrecao>("IPCA-E");
  const [dataInicio, setDataInicio] = useState<string>("");
  const [valor, setValor] = useState<string>("");
  const [tipoCalculo, setTipoCalculo] = useState<string>("");
  const [usarTotalGeral, setUsarTotalGeral] = useState<boolean>(false);
  const [usarDataAdmissao, setUsarDataAdmissao] = useState<boolean>(false);
  
  const { valorCorrigido, setValorCorrigido, calcularCorrecaoMonetaria } = useCalculoCorrecao();

  // Função para calcular a correção monetária baseada nos índices selecionados
  const handleCalcularCorrecaoMonetaria = () => {
    // Se o usuário escolheu usar o Total Geral
    const valorNumerico = usarTotalGeral 
      ? totalGeral 
      : parseFloat(valor.replace(/\./g, '').replace(',', '.'));
    
    calcularCorrecaoMonetaria({
      valor: valorNumerico,
      dataInicio,
      indiceCorrecao
    });
  };
  
  const handleAplicarCorrecao = () => {
    if (valorCorrigido !== null) {
      onAplicarCorrecao(valorCorrigido);
      
      toast({
        title: "Correção monetária aplicada",
        description: `Valor corrigido: ${formatarMoeda(valorCorrigido)} (${indiceCorrecao})`,
      });
    }
  };
  
  const formatarValorInput = (valor: string) => {
    // Remove caracteres não numéricos
    let numerico = valor.replace(/\D/g, '');
    
    // Converte para número e formata como moeda
    if (numerico) {
      const numero = parseInt(numerico) / 100;
      return numero.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    }
    return '';
  };
  
  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValor(formatarValorInput(e.target.value));
  };

  // Handle checkbox change for using Total Geral
  const handleUsarTotalGeralChange = (checked: boolean) => {
    setUsarTotalGeral(checked);
    if (checked && totalGeral > 0) {
      setValor(formatarMoeda(totalGeral));
    }
  };

  // Handle checkbox change for using the admission date
  const handleUsarDataAdmissaoChange = (checked: boolean) => {
    setUsarDataAdmissao(checked);
    if (checked && dataAdmissao) {
      // Format the date from yyyy-MM-dd to dd/MM/yyyy for display
      const parts = dataAdmissao.split('-');
      if (parts.length === 3) {
        setDataInicio(`${parts[2]}/${parts[1]}/${parts[0]}`);
      } else {
        setDataInicio(dataAdmissao);
      }
    } else if (!checked) {
      setDataInicio("");
    }
  };

  // Import formatter to avoid circular dependency
  const formatarMoeda = (valor: number): string => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Correção Monetária</CardTitle>
        <CardDescription>
          Atualize valores com índices de correção monetária utilizados pela Justiça do Trabalho
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Alert com informações sobre a metodologia de correção */}
        <Alert className="bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-500" />
          <AlertTitle>Metodologia de Correção Monetária</AlertTitle>
          <AlertDescription className="text-sm mt-2">
            <p className="mb-2">
              A correção será aplicada mensalmente com base no índice de correção determinado pelo TST, 
              que pode ser o INPC, IPCA-E ou TR.
            </p>
            
            <p className="mb-2">
              <strong>Cálculo de correção:</strong> Valor corrigido = Valor original × (1 + índice de correção)
            </p>
            
            <div className="mb-2">
              <strong>Aplicação por tipo de verba:</strong>
              <ul className="list-disc pl-5 mt-1">
                <li>
                  <strong>Saldo de salário:</strong> Corrigido de acordo com o INPC ou IPCA-E (se a rescisão não foi feita no mês de vencimento).
                </li>
                <li>
                  <strong>Férias:</strong> Corrigidas desde a data de seu vencimento até a data de pagamento, com INPC ou IPCA-E.
                </li>
                <li>
                  <strong>13º Salário:</strong> Correção de dezembro até a data do pagamento, com INPC ou IPCA-E.
                </li>
              </ul>
            </div>
            
            <p>
              <strong>Juros de mora:</strong> Além da correção monetária, os juros de mora (1% ao mês) podem ser aplicados 
              a partir da data de vencimento da dívida, conforme o art. 883 da CLT.
            </p>
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <IndiceSelecao 
            indiceCorrecao={indiceCorrecao} 
            onChange={(value) => setIndiceCorrecao(value)} 
          />

          <DataInicioInput
            dataInicio={dataInicio}
            usarDataAdmissao={usarDataAdmissao}
            dataAdmissao={dataAdmissao}
            onDataInicioChange={setDataInicio}
            onUsarDataAdmissaoChange={handleUsarDataAdmissaoChange}
          />

          <ValorInput
            valor={valor}
            usarTotalGeral={usarTotalGeral}
            totalGeral={totalGeral}
            onValorChange={handleValorChange}
            onUsarTotalGeralChange={handleUsarTotalGeralChange}
          />

          <div>
            <Label htmlFor="tipoCalculo" className="text-base font-medium">
              Tipo de cálculo anterior
            </Label>
            <Input
              id="tipoCalculo"
              placeholder="Ex: horas extras, 13º salário, etc."
              value={tipoCalculo}
              onChange={(e) => setTipoCalculo(e.target.value)}
              className="mt-2"
            />
          </div>

          <div className="pt-2">
            <Button 
              onClick={handleCalcularCorrecaoMonetaria}
              className="w-full bg-juriscalc-navy"
            >
              Calcular Correção Monetária
            </Button>
          </div>

          {valorCorrigido !== null && (
            <ResultadoCorrecao
              valorCorrigido={valorCorrigido}
              valorOriginal={valor}
              indiceCorrecao={indiceCorrecao}
              dataInicio={dataInicio}
              onAplicarCorrecao={handleAplicarCorrecao}
              usarTotalGeral={usarTotalGeral}
              totalGeral={totalGeral}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CorrecaoMonetaria;
