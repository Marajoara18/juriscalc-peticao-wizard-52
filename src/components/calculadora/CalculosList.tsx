
import React from 'react';
import { CalculoSalvo } from '@/types/calculoSalvo';
import CalculoItem from './CalculoItem';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Crown } from "lucide-react";
import { useSupabaseAuthOnly } from '@/hooks/auth/useSupabaseAuthOnly';
import { useSupabaseCalculationLimits } from '@/hooks/calculadora/useSupabaseCalculationLimits';

interface CalculosListProps {
  calculosFiltrados: CalculoSalvo[];
  onEdit: (calculo: CalculoSalvo) => void;
  onDelete: (id: string) => void;
  onUse: (calculo: CalculoSalvo) => void;
  onReopen: (calculo: CalculoSalvo) => void;
  onPreview: (calculo: CalculoSalvo) => void;
  onVerify: (calculo: CalculoSalvo) => void;
  onUsePeticao: (calculo: CalculoSalvo) => void;
}

const CalculosList: React.FC<CalculosListProps> = ({
  calculosFiltrados,
  onEdit,
  onDelete,
  onUse,
  onReopen,
  onPreview,
  onVerify,
  onUsePeticao
}) => {
  const { profile } = useSupabaseAuthOnly();
  const { calculosRealizados, calculosRestantes, limiteMaximo } = useSupabaseCalculationLimits();
  
  const isPremium = profile?.plano_id?.includes('premium') || profile?.plano_id === 'admin';

  return (
    <div>
      <Alert className={`mb-4 ${isPremium ? 'bg-yellow-50 text-yellow-800 border-yellow-200' : 'bg-blue-50 text-blue-800 border-blue-200'}`}>
        <div className="flex items-center">
          {isPremium && <Crown className="h-4 w-4 text-yellow-600 mr-2" />}
          <AlertCircle className={`h-4 w-4 ${isPremium ? 'text-yellow-600' : 'text-blue-600'}`} />
        </div>
        <AlertDescription className="text-sm">
          {isPremium ? (
            <>
              <strong>Plano Premium:</strong> Você está utilizando {calculosFiltrados.length} cálculos salvos. 
              Com o plano premium, você pode salvar quantos cálculos quiser!
            </>
          ) : (
            <>
              Você está utilizando {calculosFiltrados.length} de {limiteMaximo} cálculos disponíveis. 
              {typeof calculosRestantes === 'number' && calculosRestantes > 0 
                ? ` Você ainda pode salvar ${calculosRestantes} cálculo${calculosRestantes !== 1 ? 's' : ''}.` 
                : ' Você atingiu o limite de cálculos salvos. Para adicionar novos, apague algum existente ou faça upgrade para o plano premium.'}
            </>
          )}
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {calculosFiltrados.map((calculo) => (
          <CalculoItem
            key={calculo.id}
            calculo={calculo}
            onEdit={() => onEdit(calculo)}
            onDelete={() => onDelete(calculo.id)}
            onUse={() => onUse(calculo)}
            onReopen={() => onReopen(calculo)}
            onPreview={() => onPreview(calculo)}
            onVerify={() => onVerify(calculo)}
            onUsePeticao={() => onUsePeticao(calculo)}
          />
        ))}
      </div>
    </div>
  );
};

export default CalculosList;
