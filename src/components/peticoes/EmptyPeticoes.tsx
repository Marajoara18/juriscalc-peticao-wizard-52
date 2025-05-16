
import React from 'react';
import { FileText } from 'lucide-react';

const EmptyPeticoes = () => {
  return (
    <div className="text-center py-12">
      <FileText size={48} className="mx-auto mb-4 text-gray-400" />
      <h3 className="text-xl font-serif font-bold mb-2">Nenhuma petição recente</h3>
      <p className="text-gray-500">Crie uma nova petição para começar</p>
    </div>
  );
};

export default EmptyPeticoes;
