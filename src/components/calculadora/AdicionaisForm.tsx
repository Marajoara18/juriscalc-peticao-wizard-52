import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AdicionaisBasicos } from './adicionais/AdicionaisBasicos';
import { VerbasAdicionais } from './adicionais/VerbasAdicionais';
import { Multas } from './adicionais/Multas';
import { OutrosAdicionais } from './adicionais/OutrosAdicionais';
import { CalculoPersonalizado } from './adicionais/CalculoPersonalizado';
import { SeguroDesemprego } from './adicionais/SeguroDesemprego';
import { Adicionais, DadosContrato } from '@/types/calculadora';

interface AdicionaisFormProps {
  adicionais: Adicionais;
  dadosContrato?: DadosContrato;
  onChange: (name: string, value: string | boolean | any) => void;
}

const AdicionaisForm: React.FC<AdicionaisFormProps> = ({ adicionais, dadosContrato, onChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionais e Multas</CardTitle>
        <CardDescription>
          Configure os adicionais e multas aplicáveis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Adicionais Básicos */}
        <div className="space-y-5">
          <h3 className="font-serif font-semibold text-juriscalc-navy">Adicionais Básicos</h3>
          <AdicionaisBasicos adicionais={adicionais} onChange={onChange} />
        </div>

        {/* Verbas e Benefícios Adicionais */}
        <div className="space-y-6">
          <Separator className="my-4" />
          <h3 className="font-serif font-semibold text-juriscalc-navy">Verbas e Benefícios Adicionais</h3>
          <VerbasAdicionais adicionais={adicionais} onChange={onChange} />
        </div>

        {/* Multas */}
        <div className="space-y-3">
          <Separator className="my-4" />
          <h3 className="font-serif font-semibold text-juriscalc-navy">Multas</h3>
          <Multas adicionais={adicionais} onChange={onChange} />
        </div>
        
        {/* Seguro-Desemprego */}
        <div className="space-y-3">
          <Separator className="my-4" />
          <h3 className="font-serif font-semibold text-juriscalc-navy">Seguro-Desemprego</h3>
          <SeguroDesemprego adicionais={adicionais} dadosContrato={dadosContrato} onChange={onChange} />
        </div>

        {/* Outros Adicionais */}
        <div className="space-y-3">
          <Separator className="my-4" />
          <h3 className="font-serif font-semibold text-juriscalc-navy">Outros Adicionais</h3>
          <OutrosAdicionais adicionais={adicionais} onChange={onChange} />
        </div>

        {/* Cálculo Personalizado */}
        <div className="space-y-3">
          <Separator className="my-4" />
          <h3 className="font-serif font-semibold text-juriscalc-navy">Cálculo Adicional Personalizado</h3>
          <CalculoPersonalizado adicionais={adicionais} onChange={onChange} />
        </div>
      </CardContent>
    </Card>
  );
};

export default AdicionaisForm;
