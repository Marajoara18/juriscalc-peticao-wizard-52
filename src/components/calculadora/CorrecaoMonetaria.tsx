import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { formatarMoeda } from '@/utils/formatters';
import { Checkbox } from "@/components/ui/checkbox";

interface CorrecaoMonetariaProps {
  onAplicarCorrecao: (valorCorrigido: number) => void;
  totalGeral?: number;
}

// Dados fictícios de índices de correção (em situação real, viriam de API)
const INDICES = {
  // Últimos 12 meses (valores fictícios para exemplo)
  "IPCA-E": [
    { mes: "04/2024", indice: 0.36 },
    { mes: "03/2024", indice: 0.40 },
    { mes: "02/2024", indice: 0.83 },
    { mes: "01/2024", indice: 0.41 },
    { mes: "12/2023", indice: 0.56 },
    { mes: "11/2023", indice: 0.46 },
    { mes: "10/2023", indice: 0.28 },
    { mes: "09/2023", indice: 0.35 },
    { mes: "08/2023", indice: 0.23 },
    { mes: "07/2023", indice: 0.17 },
    { mes: "06/2023", indice: 0.11 },
    { mes: "05/2023", indice: 0.36 }
  ],
  "INPC": [
    { mes: "04/2024", indice: 0.38 },
    { mes: "03/2024", indice: 0.44 },
    { mes: "02/2024", indice: 0.81 },
    { mes: "01/2024", indice: 0.57 },
    { mes: "12/2023", indice: 0.55 },
    { mes: "11/2023", indice: 0.63 },
    { mes: "10/2023", indice: 0.12 },
    { mes: "09/2023", indice: 0.21 },
    { mes: "08/2023", indice: 0.20 },
    { mes: "07/2023", indice: 0.07 },
    { mes: "06/2023", indice: 0.18 },
    { mes: "05/2023", indice: 0.40 }
  ],
  "TR": [
    { mes: "04/2024", indice: 0.08 },
    { mes: "03/2024", indice: 0.08 },
    { mes: "02/2024", indice: 0.07 },
    { mes: "01/2024", indice: 0.06 },
    { mes: "12/2023", indice: 0.06 },
    { mes: "11/2023", indice: 0.05 },
    { mes: "10/2023", indice: 0.04 },
    { mes: "09/2023", indice: 0.04 },
    { mes: "08/2023", indice: 0.03 },
    { mes: "07/2023", indice: 0.03 },
    { mes: "06/2023", indice: 0.02 },
    { mes: "05/2023", indice: 0.02 }
  ]
};

const CorrecaoMonetaria: React.FC<CorrecaoMonetariaProps> = ({ onAplicarCorrecao, totalGeral = 0 }) => {
  const [indiceCorrecao, setIndiceCorrecao] = useState<"IPCA-E" | "INPC" | "TR">("IPCA-E");
  const [dataInicio, setDataInicio] = useState<string>("");
  const [valor, setValor] = useState<string>("");
  const [tipoCalculo, setTipoCalculo] = useState<string>("");
  const [valorCorrigido, setValorCorrigido] = useState<number | null>(null);
  const [usarTotalGeral, setUsarTotalGeral] = useState<boolean>(false);

  // Função para calcular a correção monetária baseada nos índices selecionados
  const calcularCorrecaoMonetaria = () => {
    // Se o usuário escolheu usar o Total Geral
    const valorNumerico = usarTotalGeral 
      ? totalGeral 
      : parseFloat(valor.replace(/\./g, '').replace(',', '.'));
    
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor numérico válido.",
        variant: "destructive"
      });
      return;
    }
    
    if (!dataInicio) {
      toast({
        title: "Data inválida",
        description: "Por favor, insira uma data de início.",
        variant: "destructive"
      });
      return;
    }
    
    // Verificar formato da data (dd/mm/aaaa)
    const dataRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dataInicio.match(dataRegex);
    
    if (!match) {
      toast({
        title: "Formato de data inválido",
        description: "Por favor, insira uma data no formato dd/mm/aaaa.",
        variant: "destructive"
      });
      return;
    }
    
    const dia = parseInt(match[1]);
    const mes = parseInt(match[2]);
    const ano = parseInt(match[3]);
    
    // Validar data
    if (dia < 1 || dia > 31 || mes < 1 || mes > 12) {
      toast({
        title: "Data inválida",
        description: "Por favor, insira uma data válida.",
        variant: "destructive"
      });
      return;
    }
    
    // Em uma aplicação real, aqui buscaríamos os índices de correção
    // Para este exemplo, usaremos valores fictícios acumulados
    
    // Vamos simular um cálculo simples de correção usando
    // os índices acumulados nos últimos 12 meses
    const indicesDisponiveis = INDICES[indiceCorrecao];
    let fatorAcumulado = 1;
    
    // Para cada mês desde a data de início até hoje, aplicamos o índice
    // Simplificação: usamos os últimos valores independente da data real
    // Em uma implementação real, buscaríamos os índices exatos para o período
    const mesAtual = new Date().getMonth();
    const dataInicioObj = new Date(ano, mes - 1, dia);
    const mesesDecorridos = Math.max(1, 
      ((new Date().getFullYear() - dataInicioObj.getFullYear()) * 12) + 
      (new Date().getMonth() - dataInicioObj.getMonth())
    );
    
    // Aplicamos os índices do período (limitado ao que temos disponível)
    const mesesACorrigir = Math.min(mesesDecorridos, indicesDisponiveis.length);
    
    for (let i = 0; i < mesesACorrigir; i++) {
      fatorAcumulado *= (1 + (indicesDisponiveis[i].indice / 100));
    }
    
    // Calcula o valor corrigido
    const valorFinalCorrigido = valorNumerico * fatorAcumulado;
    
    setValorCorrigido(valorFinalCorrigido);
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

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Correção Monetária</CardTitle>
        <CardDescription>
          Atualize valores com índices de correção monetária utilizados pela Justiça do Trabalho
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <Label className="text-base font-medium">Índice de Correção</Label>
            <RadioGroup 
              value={indiceCorrecao} 
              onValueChange={(value) => setIndiceCorrecao(value as "IPCA-E" | "INPC" | "TR")}
              className="flex flex-col space-y-2 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="IPCA-E" id="ipca-e" />
                <Label htmlFor="ipca-e" className="cursor-pointer">
                  IPCA-E (Índice Nacional de Preços ao Consumidor Amplo – Especial)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="INPC" id="inpc" />
                <Label htmlFor="inpc" className="cursor-pointer">
                  INPC (Índice Nacional de Preços ao Consumidor)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="TR" id="tr" />
                <Label htmlFor="tr" className="cursor-pointer">
                  TR (Taxa Referencial)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="dataInicio" className="text-base font-medium">
              Data de início do cálculo
            </Label>
            <Input
              id="dataInicio"
              placeholder="dd/mm/aaaa"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <div className="flex justify-between items-center">
              <Label htmlFor="valor" className="text-base font-medium">
                Valor a ser atualizado
              </Label>
              {totalGeral > 0 && (
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="usarTotalGeral" 
                    checked={usarTotalGeral} 
                    onCheckedChange={handleUsarTotalGeralChange}
                  />
                  <Label htmlFor="usarTotalGeral" className="text-sm cursor-pointer">
                    Usar Total Geral ({formatarMoeda(totalGeral)})
                  </Label>
                </div>
              )}
            </div>
            <Input
              id="valor"
              placeholder="R$ 0,00"
              value={usarTotalGeral && totalGeral > 0 ? formatarMoeda(totalGeral) : valor}
              onChange={handleValorChange}
              className="mt-2"
              disabled={usarTotalGeral}
            />
          </div>

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
              onClick={calcularCorrecaoMonetaria}
              className="w-full bg-juriscalc-navy"
            >
              Calcular Correção Monetária
            </Button>
          </div>

          {valorCorrigido !== null && (
            <div className="pt-2 border-t border-gray-200 mt-4">
              <div className="bg-gray-50 rounded-md p-4">
                <h3 className="font-medium text-lg mb-2">Resultado:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span>Valor original:</span>
                  <span className="font-medium text-right">
                    {usarTotalGeral && totalGeral > 0 ? formatarMoeda(totalGeral) : valor}
                  </span>
                  
                  <span>Índice aplicado:</span>
                  <span className="font-medium text-right">{indiceCorrecao}</span>
                  
                  <span>Data inicial:</span>
                  <span className="font-medium text-right">{dataInicio}</span>
                  
                  <span>Valor corrigido:</span>
                  <span className="font-bold text-right text-juriscalc-navy">
                    {formatarMoeda(valorCorrigido)}
                  </span>
                </div>
                
                <div className="mt-4">
                  <Button 
                    onClick={handleAplicarCorrecao}
                    className="w-full bg-juriscalc-gold text-juriscalc-navy hover:bg-opacity-90"
                  >
                    Atualizar com Correção Monetária
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CorrecaoMonetaria;
