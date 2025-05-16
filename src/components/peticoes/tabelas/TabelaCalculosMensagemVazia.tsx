
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const TabelaCalculosMensagemVazia: React.FC = () => {
  return (
    <Card className="mb-6 border-dashed border-2 border-gray-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Cálculos Trabalhistas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6">
          <p className="text-gray-500 mb-4">Não há cálculos disponíveis para exibir.</p>
          <p className="text-sm text-gray-400">
            Utilize a calculadora trabalhista para gerar valores e incluir na petição.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TabelaCalculosMensagemVazia;
