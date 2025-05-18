
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { formatarMoeda } from '@/utils/formatters';

interface HonorariosAdvocaticiosProps {
  totalGeral: number;
  onAplicarHonorarios: (valorHonorarios: number) => void;
}

const HonorariosAdvocaticios: React.FC<HonorariosAdvocaticiosProps> = ({
  totalGeral,
  onAplicarHonorarios
}) => {
  const [percentualHonorarios, setPercentualHonorarios] = useState('20');
  const [incluirNoTotalGeral, setIncluirNoTotalGeral] = useState(false);
  const [valorCalculado, setValorCalculado] = useState(0);
  
  // Atualizar o valor calculado quando o percentual ou total mudar
  useEffect(() => {
    const percentual = parseFloat(percentualHonorarios) || 20;
    // Cálculo do valor baseado no percentual escolhido sobre o subtotal (totalGeral)
    // Nota: O totalGeral aqui na verdade é o subtotal antes dos honorários
    const valor = totalGeral * (percentual / 100);
    setValorCalculado(valor);
  }, [percentualHonorarios, totalGeral]);
  
  const calcularHonorarios = () => {
    // Passamos diretamente o valorCalculado para a função de callback
    // sem fazer nenhum cálculo adicional
    onAplicarHonorarios(valorCalculado);
  };

  return (
    <Card className="mt-4">
      <CardContent className="pt-6 space-y-4">
        <h3 className="font-serif font-semibold text-juriscalc-navy">
          Honorários Advocatícios
        </h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="percentualHonorariosAdvocaticios">
              Percentual dos Honorários (%)
            </Label>
            <Input 
              id="percentualHonorariosAdvocaticios" 
              value={percentualHonorarios}
              onChange={(e) => setPercentualHonorarios(e.target.value)}
              type="number"
              min="1"
              max="100"
              placeholder="20"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="incluirNoTotalGeral">
              Incluir valor no total geral
            </Label>
            <Switch 
              id="incluirNoTotalGeral"
              checked={incluirNoTotalGeral}
              onCheckedChange={(checked) => {
                setIncluirNoTotalGeral(checked);
              }}
            />
          </div>
          
          <div className="pt-2">
            <div className="bg-gray-50 p-3 rounded-md border mb-3">
              <p className="text-sm font-medium text-gray-700">
                Valor calculado dos honorários: {formatarMoeda(valorCalculado)}
              </p>
            </div>
            
            <Button 
              onClick={calcularHonorarios}
              className="w-full bg-juriscalc-navy text-white hover:bg-opacity-90"
              disabled={totalGeral <= 0}
            >
              Aplicar Honorários Advocatícios
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HonorariosAdvocaticios;
